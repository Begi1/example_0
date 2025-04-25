"use client";
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { User } from '../types';  // Import the User interface for type safety

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message on each submission

    // Basic client-side validation
    if (!email || !name || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data: User = await res.json();  // Use the User type for better type safety
      console.log('Signup success:', data);

      // Redirect to /home
      router.push('/home');
    } catch (err) {
      if (err instanceof Error) {
        console.error('Signup failed:', err);
        setError(err.message); // Set error message to state
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main style={{ backgroundColor: '#121212', minHeight: '100vh', paddingTop: '2rem', color: 'white' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            color: 'white'
          }}
        >
          <Typography component="h1" fontWeight="bold" sx={{ textAlign: 'center', color: '#fff' }}>Welcome!</Typography>

          {/* Display error message */}
          {error && <Typography color="error" sx={{ textAlign: 'center', fontSize: '14px' }}>{error}</Typography>}

          <FormControl>
            <FormLabel sx={{ color: 'white' }}>Name</FormLabel>
            <Input
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ color: 'white' }}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: 'white' }}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ color: 'white' }}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: 'white' }}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ color: 'white' }}
              required
            />
          </FormControl>

          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1 }}>
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>

          <Typography sx={{ fontSize: 'sm', alignSelf: 'center', color: 'gray' }}>
            Already have an account?
            <Link href="/signin" style={{ color: '#1976d2', marginLeft: '4px' }}>Sign in</Link>
          </Typography>
        </Box>
      </main>
    </>
  );
}
