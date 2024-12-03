'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    isAnonymous: false
  });
  const router = useRouter();

  useEffect(() => {
    // Try to get user profile if logged in
    const fetchUserProfile = async () => {
      try {
        const profile = await api.user.getProfile();
        setUserInfo(prev => ({
          ...prev,
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email
        }));
      } catch (error) {
        // User not logged in or error fetching profile
        console.log('User not logged in or error fetching profile');
      }
    };
    fetchUserProfile();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setError('Failed to load payment gateway. Please try again.');
        return;
      }

      // Create order with user information
      const { orderId } = await api.donations.createOrder({
        amount: parseFloat(amount),
        userInfo: {
          ...userInfo,
          isAnonymous: userInfo.isAnonymous
        }
      });

      // Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // amount in paisa
        currency: "INR",
        name: "Alumni Association",
        description: "Donation to Alumni Association",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment with user information
            await api.donations.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              userInfo: {
                ...userInfo,
                isAnonymous: userInfo.isAnonymous
              }
            });
            
            setMessage('Thank you for your donation!');
            setAmount('');
            
            // Refresh the donation progress
            router.refresh();
          } catch (err) {
            setError('Payment verification failed. Please contact support if amount was deducted.');
          }
        },
        prefill: {
          name: userInfo.isAnonymous ? '' : userInfo.name,
          email: userInfo.isAnonymous ? '' : userInfo.email,
          contact: userInfo.isAnonymous ? '' : userInfo.phone
        },
        theme: {
          color: "#2563eb"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Donation Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="100"
            step="1"
            placeholder="Minimum ₹100"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={userInfo.isAnonymous}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-300">
              Make this donation anonymous
            </label>
          </div>

          {!userInfo.isAnonymous && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!userInfo.isAnonymous}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!userInfo.isAnonymous}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
            </>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          disabled={loading || !amount || parseFloat(amount) < 100}
        >
          {loading ? 'Processing...' : 'Make Donation'}
        </button>
      </form>
    </>
  );
}