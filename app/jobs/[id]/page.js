'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../utils/api';
import { motion } from 'framer-motion';
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar } from 'react-icons/hi';

export default function JobDetails() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const { id } = useParams();
  const router = useRouter();

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

  const handleApply = async () => {
    setIsApplying(true);
    try {
      // Add your application logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      alert('Application submitted successfully!');
      router.push('/jobs');
    } catch (err) {
      console.error('Error applying to job:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button 
          onClick={() => router.push('/jobs')}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Job not found</h1>
        <button 
          onClick={() => router.push('/jobs')}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button 
        onClick={() => router.push('/jobs')}
        className="text-gray-400 hover:text-white mb-8 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Jobs
      </button>

      <div className="space-y-8">
        <div className="border-b border-gray-800 pb-8">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {job.title}
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center">
              <HiOutlineOfficeBuilding className="w-5 h-5 mr-2" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center">
              <HiOutlineLocationMarker className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <HiOutlineCurrencyDollar className="w-5 h-5 mr-2" />
              <span>{job.salary || 'Salary not specified'}</span>
            </div>
            <div className="flex items-center">
              <HiOutlineCalendar className="w-5 h-5 mr-2" />
              <span>
                Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Job Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </section>

          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start text-gray-300"
                  >
                    <svg className="w-5 h-5 mr-2 mt-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {req}
                  </motion.li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            disabled={isApplying}
            className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isApplying ? 'Submitting Application...' : 'Apply for this Position'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}