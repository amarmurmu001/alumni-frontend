'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup } from 'react-icons/hi';
import { api } from '../utils/api';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.events.getEvents({
        page,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'asc'
      });

      // Filter out past events
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
      
      const upcomingEvents = (data.events || []).filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
        return eventDate >= now;
      });

      setEvents(upcomingEvents);
      // Adjust total pages based on filtered events count
      const totalUpcomingEvents = upcomingEvents.length;
      const calculatedTotalPages = Math.ceil(totalUpcomingEvents / 10);
      setTotalPages(calculatedTotalPages || 1);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/70 animate-pulse">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70">
          {error}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-white/70 text-center py-12">
        No upcoming events available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventCard key={event._id} event={event} index={index} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}

function EventCard({ event, index }) {
  return (
    <Link href={`/events/${event._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6
          hover:bg-white/10 transition-all cursor-pointer"
      >
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-white/60">
            <HiOutlineCalendar className="w-5 h-5 mr-2" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-white/60">
            <HiOutlineLocationMarker className="w-5 h-5 mr-2" />
            {event.location}
          </div>
          {event.attendees && (
            <div className="flex items-center text-white/60">
              <HiOutlineUserGroup className="w-5 h-5 mr-2" />
              {event.attendees.length} attending
            </div>
          )}
        </div>
        <p className="text-white/70 line-clamp-3">{event.description}</p>
      </motion.div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === page 
              ? 'bg-white text-black font-semibold' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          {page}
        </motion.button>
      ))}
    </div>
  );
}