'use client';

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthorized } from '../app/lib/store/authSlice'; // Adjust path as needed

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: any) => state.auth.authorized);
    console.log("auth: " + isAuthorized)
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
  
      dispatch(setAuthorized(false));
      router.push('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/home" passHref>
              Home
            </Link>
          </Typography>

          {isAuthorized ? (
            <>
              <Link href="/teams">
                <Button color="inherit">
                  Teams
                </Button>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin" passHref>
                <Button color="inherit">Sign in</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button color="inherit">Sign up</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
