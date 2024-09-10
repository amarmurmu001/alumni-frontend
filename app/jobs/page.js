'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';
import CreateJobForm from './CreateJobForm';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

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
  }, []);

  const handleJobCreated = () => {
    fetchJobs();
    setIsCreateFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <button
          onClick={() => setIsCreateFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Post a New Job
        </button>
      </div>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-300 mb-2">{job.company}</p>
              <p className="text-gray-400 mb-4">{job.location}</p>
              <p className="text-sm text-gray-400">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {isCreateFormOpen && (
        <CreateJobForm 
          onJobCreated={handleJobCreated} 
          onClose={() => setIsCreateFormOpen(false)}
        />
      )}
    </div>
  );
}