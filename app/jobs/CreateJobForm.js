'use client';

import React, { useState } from 'react';
import { api } from '../utils/api';
import Toast from '../components/Toast';

export default function CreateJobForm({ onClose, onJobCreated }) {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    applicationDeadline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const createdJob = await api.jobs.createJob(jobData);
      console.log('Job created:', createdJob);
      onJobCreated();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="company"
          value={jobData.company}
          onChange={handleChange}
          placeholder="Company"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={jobData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
          className="w-full p-2 border rounded"
        ></textarea>
        <textarea
          name="requirements"
          value={jobData.requirements}
          onChange={handleChange}
          placeholder="Job Requirements"
          required
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="text"
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="applicationDeadline"
          value={jobData.applicationDeadline}
          onChange={handleChange}
          placeholder="Application Deadline"
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
      {showToast && (
        <Toast
          message="Job posted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}