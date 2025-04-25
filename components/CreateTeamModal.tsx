import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
} from "@mui/material";

// Define prop types for the modal
interface CreateTeamModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  open,
  handleClose,
}) => {
  const [teamName, setTeamName] = useState<string>(""); // Store team name input
  const [teamId, setTeamId] = useState<string | null>(null); // Store generated team ID
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state to show copy success
  const [error, setError] = useState<string | null>(null); // Error handling state


  const handleCreate = async () => {
    if (!teamName.trim()) {
      setError("Please provide a team name.");
      return;
    }
  
    let userId: string | null = null;
  
    // Decode token to get user ID
    try {
      const res = await fetch("/api/auth/decode-token", {
        method: "GET",
        credentials: "include",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to decode token");
      }
  
      console.log("Decoded token:", data); // Now you have access to the decoded token
      userId = data._id; // Assuming `_id` is in the decoded token
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
      return;
    }
  
    if (!userId) {
      setError("User ID not found in token.");
      return;
    }
  
    const newTeam = { 
      teamName, 
      members: [userId] // Add userId as a string (not an object)
    };
  
    // Create the team
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeam),
      });
  
      if (!res.ok) {
        throw new Error("Failed to create team");
      }
  
      const data = await res.json();
      setTeamId(data.id); // Set the team ID if created successfully
      setError(null); // Reset error if team is created successfully
  
      // Now add the team ID to the user's teams array
      try {
        const addTeamRes = await fetch("/api/users/addTeamToUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, teamId: data.id }),
        });
  
        if (!addTeamRes.ok) {
          throw new Error("Failed to add team to user");
        }
  
        console.log("Team added to user successfully!");
      } catch (err) {
        console.error("Error adding team to user:", err);
        setError("Error adding team to user.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      setError("Error creating team.");
    }
  };
  

  // Handle copying the team ID to clipboard
  const handleCopy = () => {
    if (teamId) {
      navigator.clipboard.writeText(teamId);
      setSnackbarOpen(true); // Show snackbar after copying
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="create-team-modal-title"
      aria-describedby="create-team-modal-description"
    >
      <Box sx={style}>
        <Typography id="create-team-modal-title" variant="h6" component="h2">
          Create Team
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={!!error} // Highlight input field in case of error
            helperText={error} // Show the error message
          />
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
          {teamId && (
            <Button variant="outlined" onClick={handleCopy}>
              Copy Team ID: {teamId}
            </Button>
          )}
        </Stack>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Team ID copied to clipboard!"
          anchorOrigin={{
            vertical: "top", // Align the Snackbar to the top
            horizontal: "center", // Align it horizontally to the center
          }}
        />
      </Box>
    </Modal>
  );
};

export default CreateTeamModal;
