'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import Link from 'next/link';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await fetchApi('/api/jobs');
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading jobs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <h3 className="text-xl font-bold mb-2 text-white">{job.title}</h3>
      <p className="text-gray-400 mb-2">{job.company}</p>
      <p className="text-gray-400 mb-2">{job.location}</p>
      <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
      <p className="text-gray-400 mb-2">Salary: {job.salary || 'Not specified'}</p>
      <p className="text-gray-400 mb-4">
        Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
      </p>
      <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:text-blue-400">
        View Details →
      </Link>
    </div>
  );
}