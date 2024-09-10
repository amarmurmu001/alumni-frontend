'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Clear any existing token when the auth page is loaded
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      let data;
      if (isLogin) {
        data = await api.auth.login(email, password);
        toast.success('Logged in successfully!');
      } else {
        data = await api.auth.register({ email, password, firstName, lastName, graduationYear, major });
        toast.success('Registered successfully!');
      }
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      if (isLogin) {
        if (err.message === 'User not found') {
          toast.error('User not registered. Please sign up.');
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } else {
        if (err.message === 'Email already registered') {
          toast.error('Email already registered. Please use a different email.');
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
      setError('Authentication failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');

    try {
      await api.auth.forgotPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (err) {
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  // ... rest of the component remains the same ...
}