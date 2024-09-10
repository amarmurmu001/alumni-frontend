'use client';

import React, { useState } from 'react';
import { api } from '../utils/api'; // Change this line if it's not already correct

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.donations.makeDonation({ amount: parseFloat(amount) });
      setMessage('Thank you for your donation!');
      setAmount('');
    } catch (err) {
      console.error('Donation error:', err);
      setError('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Donation Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          min="1"
          step="0.01"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Make Donation'}
      </button>
    </form>
  );
}