'use client';

import { useState } from 'react';
import JobList from './JobList';
import CreateJobForm from './CreateJobForm';

export default function Jobs() {
  const [showJobForm, setShowJobForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Job Opportunities</h1>
      <button
        onClick={() => setShowJobForm(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post a Job
      </button>
      <JobList key={refreshKey} />
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
            <CreateJobForm
              onClose={() => setShowJobForm(false)}
              onJobCreated={handleJobCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}