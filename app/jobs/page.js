'use client';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import JobList from './JobList';
import CreateJobForm from './CreateJobForm';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const fetchedJobs = await api.jobs.getJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleJobCreated = () => {
    fetchJobs();
    setIsCreateFormOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-5">
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-4xl font-bold text-white"
          >
            Career Opportunities
          </motion.h1>
          {isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateFormOpen(true)}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Post a New Job
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button 
              onClick={fetchJobs}
              className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          <JobList jobs={jobs} />
        )}

        {isCreateFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black rounded-lg border border-gray-800 shadow-xl max-w-2xl w-full mx-4"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Job</h2>
                  <button 
                    onClick={() => setIsCreateFormOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <CreateJobForm 
                  onJobCreated={handleJobCreated} 
                  onClose={() => setIsCreateFormOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}