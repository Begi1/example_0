'use client';
import Navbar from "@/components/Navbar";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import CreateTeamModal from "@/components/CreateTeamModal"; // Import the renamed modal
import { useSelector } from 'react-redux';  // Import useSelector

const Home: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [teamId, setTeamId] = useState<string>(''); // To track ID field value
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // For success/error messages

  const user = useSelector((state: any) => state.auth.user);  // Access user from redux

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleJoinTeam = async () => {
    // Basic validation for team ID
    if (teamId.trim() === '') {
      setError('Please enter a valid ID');
      return;
    }
    if (!user || !user._id) {
      setError('User is not logged in');
      return;
    }

    setError('');
    
    try {
      // Make a POST request to the API endpoint
      const response = await fetch('/api/users/addTeamToUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,  // Pass user._id
          teamId: teamId,    // Pass the teamId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Team added successfully!');
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (error) {
      setError('Failed to join team. Please try again.');
      console.error(error);
    }
  };

  // Log user information when component mounts
  useEffect(() => {
    if (user) {
      console.log('User:', user);  // Log user object when available
    }
  }, [user]);  // Run whenever user changes

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          padding: 2,
          borderRadius: 2,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
            label="Team ID"
            variant="outlined"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              width: {
                xs: '100%',
                sm: '1000px',
              },
              height: '56px',
              '& .MuiInputBase-root': {
                height: '100%',
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleJoinTeam}
            sx={{
              width: {
                xs: '100%',
                sm: '150px',
              },
              height: '56px',
            }}
          >
            Join Team
          </Button>
        </Box>

        {/* Display success or error message */}
        {message && (
          <Typography
            variant="body1"
            sx={{
              marginTop: 2,
              color: 'green',
              textAlign: 'center',
              fontSize: '1.1rem',
            }}
          >
            {message}
          </Typography>
        )}
        {error && (
          <Typography
            variant="body1"
            sx={{
              marginTop: 2,
              color: 'red',
              textAlign: 'center',
              fontSize: '1.1rem',
            }}
          >
            {error}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{
            marginTop: 2,
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'primary.main',
            textAlign: 'center',
            fontSize: '1.1rem',
          }}
          onClick={handleOpen}
        >
          Create Team
        </Typography>
      </Box>

      {/* Use the CreateTeamModal component */}
      <CreateTeamModal open={open} handleClose={handleClose} />
    </>
  );
};

export default Home;
