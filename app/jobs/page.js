'use client';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import JobList from './JobList';
import CreateJobForm from './CreateJobForm';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        {isLoggedIn && (
          <button
            onClick={() => setIsCreateFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post a New Job
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <JobList jobs={jobs} />
      )}

      {isCreateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
            <CreateJobForm 
              onJobCreated={handleJobCreated} 
              onClose={() => setIsCreateFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}