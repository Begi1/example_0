"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
  Container,
  Alert, // Import Alert from Material UI
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

interface Team {
  _id: string; // Ensure the team has an _id field.
  name: string;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null); // State to store success message for the alert

  // Fetch the user ID and teams for the user
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/decode-token", {
          method: "GET",
          credentials: "include", // Ensure credentials are included (if necessary)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to decode token");
        }

        console.log("Decoded token:", data); // Log the entire decoded token here
        // Set the userId from the token data (use data._id instead of data.id)
        setUserId(data._id); // Corrected: Using _id from the token
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };

    fetchToken();
  }, []);

  // Fetch user data when userId is available
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const res = await fetch(`/api/users/getUser?id=${userId}`, {
            method: "GET",
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to fetch user data");
          }

          console.log("User data:", data); // Log the user data here
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Error fetching user data.");
        }
      }
    };

    fetchUser();
  }, [userId]); // Trigger when userId is available

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const res = await fetch(`/api/users/getUser?id=${userId}`, {
            method: "GET",
          });
  
          const data = await res.json();
  
          if (!res.ok) {
            throw new Error(data.error || "Failed to fetch user data");
          }
  
          console.log("User data:", data);
          const teamIds = data.teams;
  
          // Fetch team data for each ID
          const teamRes = await fetch(
            `/api/teams?${teamIds.map((id: any) => `ids=${id}`).join("&")}`,
            {
              method: "GET",
            }
          );
  
          const teamData = await teamRes.json();
  
          if (!teamRes.ok) {
            throw new Error(teamData.message || "Failed to fetch teams");
          }
  
          setTeams(teamData); // Set fetched team data
        } catch (err) {
          console.error("Error fetching user or teams:", err);
          setError("Error fetching user or teams.");
        }
      }
    };
  
    fetchUser();
  }, [userId]);

  // Function to copy the team ID to clipboard
  const copyToClipboard = (teamId: string) => {
    navigator.clipboard.writeText(teamId).then(() => {
      setCopySuccess("Team ID copied to clipboard!"); // Update the success message
      setTimeout(() => {
        setCopySuccess(null); // Clear the message after 3 seconds
      }, 3000);
    }).catch((err) => {
      console.error("Failed to copy text:", err);
      setCopySuccess("Failed to copy Team ID."); // Handle error
    });
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ padding: "16px" }}>
        {error && <Typography color="error" variant="h6">{error}</Typography>}
        
        {/* Show alert if copy success */}
        {copySuccess && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {copySuccess}
          </Alert>
        )}

        {/* Map over the teams and create an Accordion for each */}
        {teams.map((team) => (
          <Accordion key={team._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${team._id}-content`}
              id={`panel-${team._id}-header`}
            >
              <Typography component="span">{team.name}</Typography> {/* Display the team name */}
            </AccordionSummary>
            <AccordionDetails>
              <Button 
                variant="outlined" 
                onClick={() => copyToClipboard(team._id)}  // On button click, copy team ID to clipboard
              >
                Team ID: {team._id} {/* Display the team ID */}
              </Button>
            </AccordionDetails>
            <AccordionActions>
              {/* You can add more actions here */}
              <Button sx={{ color: "red" }}>Delete</Button>
              <Link href="/team"><Button>Open</Button></Link>
            </AccordionActions>
          </Accordion>
        ))}
      </Container>
    </>
  );
}
