'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '../../utils/api';

export default function JobDetails() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const jobData = await fetchApi(`/jobs/${id}`);
        setJob(jobData);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-xl mb-2">{job.company}</p>
      <p className="text-lg mb-4">{job.location}</p>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p>{job.description}</p>
      </div>
      {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-lg mb-2">Salary: {job.salary || 'Not specified'}</p>
      <p className="text-lg mb-4">
        Application Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
      </p>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Apply Now
      </button>
    </div>
  );
}