'use client';

import React, { useState } from 'react';
import { fetchApi } from '../utils/api';
import Toast from '../components/Toast';

export default function DonationForm() {
  const [donationData, setDonationData] = useState({
    amount: '',
    donorName: '',
    email: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetchApi('/api/donations', {
        method: 'POST',
        body: JSON.stringify(donationData),
      });

      console.log('Donation submitted:', response);
      setShowToast(true);
      setDonationData({ amount: '', donorName: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting donation:', error);
      // Show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Donation Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={donationData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="donorName" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            id="donorName"
            name="donorName"
            value={donationData.donorName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={donationData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={donationData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit Donation'}
        </button>
      </form>
      {showToast && (
        <Toast
          message="Thank you for your donation!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}