'use client';
import * as React from 'react';
import { Box, CssBaseline, Typography, FormControl, FormLabel, Input, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { setAuthorized } from '../lib/store/authSlice';
import { useDispatch } from 'react-redux';

export default function Signin() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Manage form state
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const handleSignin = async () => {
    setError(''); // Reset error on every submit attempt
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const data = await res.json();
        // Save token in localStorage or cookies (adjust for your environment)
        localStorage.setItem('token', data.token);
        
        dispatch(setAuthorized(true));

        const redirectUrl = new URL(window.location.href).searchParams.get('redirect') || '/home';
        router.push(redirectUrl);  // Redirect to the original requested page
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Signin error:', err);
    }
  };
  

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main style={{ backgroundColor: '#121212', minHeight: '100vh', paddingTop: '2rem', color: 'white' }}>
        <Box
          sx={{
            width: 300,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#1e1e1e',
            color: 'white',
          }}
        >
          <Typography component="h1" fontWeight="bold">
            Welcome!
          </Typography>
          {error && (
            <Typography sx={{ color: 'red', textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <FormControl>
            <FormLabel sx={{ color: 'white' }}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              sx={{ color: 'white' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ color: 'white' }}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              sx={{ color: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleSignin}>
            Sign in
          </Button>
          <Typography sx={{ fontSize: 'sm', alignSelf: 'center', color: 'gray' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#1976d2', marginLeft: '4px' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </main>
    </>
  );
}
