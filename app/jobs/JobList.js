'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && job.type === filter;
  });

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-transparent border border-gray-800 rounded-lg focus:outline-none focus:border-white text-white"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <JobCard key={job._id} job={job} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative bg-black border border-gray-800 rounded-xl p-6 hover:border-white transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
          <p className="text-gray-400 mb-2">{job.company}</p>
          <p className="text-gray-400 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </p>
          <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
          
          <div className="space-y-2">
            <p className="text-gray-400">
              <span className="font-medium text-white">Salary:</span> {job.salary || 'Not specified'}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Deadline:</span> {' '}
              {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
            </p>
          </div>
        </div>

        <Link 
          href={`/jobs/${job._id}`}
          className="inline-flex items-center mt-4 text-white hover:text-gray-300 font-medium group"
        >
          View Details
          <svg 
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}