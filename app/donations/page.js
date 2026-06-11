'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DonationForm from './DonationForm';
import { api } from '../utils/api';

export default function Donations() {
  const [progress, setProgress] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDonationData();
  }, []);

  const fetchDonationData = async () => {
    try {
      const [prog, history] = await Promise.all([
        api.donations.getDonationProgress(),
        api.donations.getDonationHistory().catch(() => [])
      ]);
      setProgress(prog);
      setRecentDonations(Array.isArray(history) ? history.slice(0, 10) : []);
    } catch (err) {
      console.error('Failed to fetch donation data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Make a Donation</h1>
          <p className="text-gray-400 text-lg mb-8">
            Support your alma mater and contribute to its growth and development
          </p>
          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="bg-white text-black font-medium py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Donate Now
            </motion.button>
          )}
        </motion.section>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <DonationForm onSuccess={fetchDonationData} />
          </motion.div>
        )}

        {!loading && progress && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-black border border-white/10 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Donation Progress</h2>
              <div className="mb-2 flex justify-between text-sm text-gray-400">
                <span>Raised: ₹{progress.total?.toLocaleString('en-IN') || '0'}</span>
                <span>Goal: ₹{progress.goal?.toLocaleString('en-IN') || '10,00,000'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress.percentage || 0, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-white h-full rounded-full"
                />
              </div>
              <p className="text-center text-gray-400 mt-2">
                {progress.percentage?.toFixed(1) || 0}% of goal achieved
              </p>
            </div>
          </motion.section>
        )}

        {recentDonations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-black border border-white/10 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Recent Donations</h2>
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <div
                    key={donation._id || index}
                    className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-gray-300">
                      {donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Anonymous'}
                    </span>
                    <span className="text-white font-medium">
                      ₹{donation.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
