'use client';

import React, { useState } from 'react';
import api from '../utils/api';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-black p-6 rounded-lg w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-black z-10 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-300 mb-1">Application Deadline</label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={jobData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-black pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-black border border-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
      {showToast && (
        <Toast
          message="Job posted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}