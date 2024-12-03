'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineBriefcase, HiOutlineUserGroup, 
         HiOutlineNewspaper, HiOutlineAcademicCap, HiOutlineLocationMarker } from 'react-icons/hi';
import Link from 'next/link';
import { api } from '@/app/utils/api';

export default function Dashboard() {
  const [feedData, setFeedData] = useState({ events: [], jobs: [] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const [eventsData, jobsData, userData] = await Promise.all([
          api.events.getEvents({ page: 1, limit: 5, sortBy: 'date', sortOrder: 'asc' })
            .catch(() => ({ events: [], totalPages: 0 })),
          api.jobs.getJobs({ limit: 5 })
            .catch(() => ({ data: [] })),
          api.user.getProfile().catch(error => {
            if (error.message === 'Unauthorized') {
              router.push('/auth');
              return null;
            }
            throw error;
          })
        ]);

        if (userData) {
          const now = new Date();
          now.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
          
          const upcomingEvents = eventsData.events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
            return eventDate >= now;
          });

          setFeedData({
            events: upcomingEvents,
            jobs: Array.isArray(jobsData) ? jobsData : []
          });
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching feed data:', error);
        setError('Failed to load feed data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const events = feedData?.events || [];
  const jobs = feedData?.jobs || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome back, {user?.firstName || 'Alumni'}!
          </motion.h1>
          <p className="text-gray-400">Here's what's happening in your alumni network</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Events */}
            <FeedSection
              title="Upcoming Events"
              icon={<HiOutlineCalendar className="w-5 h-5" />}
              viewAllLink="/events"
            >
              {feedData.events.length > 0 ? (
                feedData.events.map((event, index) => (
                  <FeedCard
                    key={event._id || index}
                    href={`/events/${event._id}`}
                    delay={index * 0.1}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <HiOutlineCalendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <HiOutlineLocationMarker className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </FeedCard>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No upcoming events at the moment
                </div>
              )}
            </FeedSection>

            {/* Recent Jobs */}
            <FeedSection
              title="Latest Job Opportunities"
              icon={<HiOutlineBriefcase className="w-5 h-5" />}
              viewAllLink="/jobs"
            >
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <FeedCard
                    key={job._id || index}
                    href={`/jobs/${job._id}`}
                    delay={index * 0.1}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <HiOutlineBriefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{job.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{job.company}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <HiOutlineLocationMarker className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                          {job.salary && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{job.salary}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </FeedCard>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No job opportunities available at the moment
                </div>
              )}
            </FeedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Your Profile</h2>
                <Link
                  href="/profile"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View Profile
                </Link>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-400 text-sm">
                  {user?.email}
                </p>
              </div>
              <div className="space-y-4 mb-6">
                {user?.currentJob && (
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 flex-shrink-0">
                      <HiOutlineBriefcase className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <span>{user.currentJob}</span>
                    </div>
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 flex-shrink-0">
                      <HiOutlineLocationMarker className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <span>{user.location}</span>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/profile/edit"
                className="block w-full px-4 py-2 bg-white text-black rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <QuickLink
                  href="/events"
                  icon={<HiOutlineCalendar className="w-5 h-5" />}
                  text="Browse Events"
                />
                <QuickLink
                  href="/jobs"
                  icon={<HiOutlineBriefcase className="w-5 h-5" />}
                  text="Find Jobs"
                />
                <QuickLink
                  href="/alumni"
                  icon={<HiOutlineUserGroup className="w-5 h-5" />}
                  text="Alumni Directory"
                />
                <QuickLink
                  href="/news"
                  icon={<HiOutlineNewspaper className="w-5 h-5" />}
                  text="Latest News"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeedSection({ title, icon, viewAllLink, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function FeedCard({ href, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={href}>
        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
          {children}
        </div>
      </Link>
    </motion.div>
  );
}

function QuickLink({ href, icon, text }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
        {icon}
        <span>{text}</span>
      </div>
    </Link>
  );
}