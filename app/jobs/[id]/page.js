'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '../../utils/api';

export default function JobDetails({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails(params.id);
  }, [params.id]);

  const fetchJobDetails = async (id) => {
    try {
      const data = await fetchApi(`/api/jobs/${id}`);
      setJob(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to fetch job details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading job details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div className="text-white">Job not found</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-black rounded-lg shadow-md border border-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-white">{job.title}</h1>
      <p className="text-gray-400 mb-2">Company: {job.company}</p>
      <p className="text-gray-400 mb-2">Location: {job.location}</p>
      <p className="text-gray-300 mb-6">{job.description}</p>
      <h2 className="text-2xl font-bold mb-2 text-white">Requirements</h2>
      <p className="text-gray-300 mb-6">{job.requirements}</p>
      <p className="text-gray-400 mb-2">Salary: {job.salary || 'Not specified'}</p>
      <p className="text-gray-400 mb-4">
        Application Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
      </p>
      <p className="text-gray-400">Posted by: {job.postedBy.firstName} {job.postedBy.lastName}</p>
    </div>
  );
}