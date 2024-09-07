'use client';

import { useState } from 'react';
import CreateJobForm from './CreateJobForm';

export default function Jobs() {
  const [showJobForm, setShowJobForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center px-8 py-16">
        <section className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Job Opportunities</h1>
          <p className="text-xl text-gray-400 mb-8">Explore career opportunities or post job openings for fellow alumni</p>
          <button
            onClick={() => setShowJobForm(true)}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
          >
            Post a Job
          </button>
        </section>

        {/* Add JobList component here */}
        
      </main>
      {showJobForm && (
        <CreateJobForm
          onClose={() => setShowJobForm(false)}
          onJobCreated={handleJobCreated}
        />
      )}
    </div>
  );
}