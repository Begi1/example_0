"use client";  // <-- Add this line to mark this file as a Client Component

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // Import useRouter for routing
import { setAuthorized, setUser } from './lib/store/authSlice'; // Import the action
import { jwtDecode } from 'jwt-decode'; // Ensure you import jwt-decode

export function Providers({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch(); // Get dispatch function from Redux
  const router = useRouter(); // Initialize router for redirection

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/api/auth/get-token', {
        method: 'GET',
        credentials: 'same-origin',  // Include cookies in the request
      });
      
      const data = await response.json();
      if (data.token) {
        const decodedToken = jwtDecode(data.token.value);
        dispatch(setUser(decodedToken)); // Decode the token
        setToken(data.token); // Store token in state or dispatch to Redux
        dispatch(setAuthorized(true)); // Dispatch action to set authorized to true
        router.push('/home'); // Redirect to /home page
      } else {
        dispatch(setAuthorized(false)); // Dispatch action to set authorized to false
        console.log('No token found in the API response');
      }
    };

    fetchToken();
  }, [dispatch, router]); // Make sure to include dispatch and router in the dependency array

  return <>{children}</>; // Just render the children as usual
}
