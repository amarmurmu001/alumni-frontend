'use client';

import React, { useState } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';

export default function CreateJobForm({ onJobCreated, onClose }) {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'full-time',
    applicationDeadline: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Convert requirements string to array
      const formattedData = {
        ...jobData,
        requirements: jobData.requirements.split('\n').filter(req => req.trim())
      };
      
      const createdJob = await api.jobs.createJob(formattedData);
      onJobCreated(createdJob);
      onClose();
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full bg-transparent rounded-lg border border-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className={labelClasses}>Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClasses}>Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={jobData.company}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="e.g. Tech Corp"
          />
        </div>
        <div>
          <label htmlFor="location" className={labelClasses}>Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="e.g. New York, NY (or Remote)"
          />
        </div>
        <div>
          <label htmlFor="type" className={labelClasses}>Job Type</label>
          <select
            id="type"
            name="type"
            value={jobData.type}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className={labelClasses}>Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            rows="4"
            className={inputClasses}
            placeholder="Describe the role, responsibilities, and what makes this position unique..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="requirements" className={labelClasses}>Requirements (one per line)</label>
          <textarea
            id="requirements"
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
            rows="4"
            className={inputClasses}
            placeholder="e.g.&#10;5+ years of experience in web development&#10;Strong knowledge of React.js&#10;Excellent communication skills"
          ></textarea>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="salary" className={labelClasses}>Salary Range</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            className={inputClasses}
            placeholder="e.g. $80,000 - $120,000/year"
          />
        </div>
        <div>
          <label htmlFor="applicationDeadline" className={labelClasses}>Application Deadline</label>
          <input
            type="date"
            id="applicationDeadline"
            name="applicationDeadline"
            value={jobData.applicationDeadline}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                currentStep === step ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-400 text-sm">Step {currentStep} of 3</span>
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(step => step - 1)}
              className="px-4 py-2 text-sm font-medium text-white border border-gray-800 rounded-lg hover:border-white transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(step => step + 1)}
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Job'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}