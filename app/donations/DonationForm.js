'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { HiCurrencyRupee, HiUser, HiMail, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-black border border-white/10 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Make a Donation</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="relative">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Donation Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiCurrencyRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-white 
                    focus:outline-none focus:ring-1 focus:ring-white focus:border-white
                    placeholder-gray-500 transition-all"
                  required
                  min="100"
                  step="1"
                  placeholder="Minimum ₹100"
                />
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="border border-white/10 rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Make this donation anonymous</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={userInfo.isAnonymous}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="w-10 h-6 bg-gray-800 rounded-full shadow-inner"></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform
                    ${userInfo.isAnonymous ? 'translate-x-4' : 'translate-x-0'}`}>
                  </div>
                </div>
              </label>
            </div>

            {/* User Information */}
            {!userInfo.isAnonymous && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-white 
                        focus:outline-none focus:ring-1 focus:ring-white focus:border-white
                        placeholder-gray-500 transition-all"
                      required={!userInfo.isAnonymous}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-white 
                        focus:outline-none focus:ring-1 focus:ring-white focus:border-white
                        placeholder-gray-500 transition-all"
                      required={!userInfo.isAnonymous}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-white 
                        focus:outline-none focus:ring-1 focus:ring-white focus:border-white
                        placeholder-gray-500 transition-all"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error and Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/10 rounded-lg p-4"
              >
                <p className="text-white text-sm">{error}</p>
              </motion.div>
            )}
            
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/10 rounded-lg p-4"
              >
                <p className="text-white text-sm">{message}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all
                ${loading || !amount || parseFloat(amount) < 100
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-white/90'}`}
              disabled={loading || !amount || parseFloat(amount) < 100}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Make Donation'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </>
  );
}