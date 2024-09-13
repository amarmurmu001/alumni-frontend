'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Link from 'next/link';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.jobs.getJobs();
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading jobs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (jobs.length === 0) {
    return <div className="text-white text-center mt-8">No jobs available at the moment.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }) {
  const [detailedJob, setDetailedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await api.jobs.getJobDetails(job._id);
      setDetailedJob(details);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to fetch job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
      {!detailedJob && !loading && (
        <button
          onClick={fetchJobDetails}
          className="text-blue-500 hover:text-blue-400"
        >
          View Details
        </button>
      )}
      {loading && <p>Loading details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {detailedJob && (
        <div>
          <h4 className="text-lg font-semibold mt-4 mb-2">Detailed Description</h4>
          <p className="text-gray-300">{detailedJob.detailedDescription || detailedJob.description}</p>
          {detailedJob.requirements && Array.isArray(detailedJob.requirements) && detailedJob.requirements.length > 0 && (
            <>
              <h4 className="text-lg font-semibold mt-4 mb-2">Requirements</h4>
              <ul className="list-disc list-inside text-gray-300">
                {detailedJob.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </>
          )}
          <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:text-blue-400 mt-4 inline-block">
            Apply Now →
          </Link>
        </div>
      )}
    </div>
  );
}