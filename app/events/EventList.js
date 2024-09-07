'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Link from 'next/link';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchEvents(currentPage, sortBy, sortOrder, filterDate);
  }, [currentPage, sortBy, sortOrder, filterDate]);

  const fetchEvents = async (page, sort, order, filter) => {
    try {
      const data = await api.events.getEvents({
        page,
        limit: 10,
        sortBy: sort,
        sortOrder: order,
        filterDate: filter
      });
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-black min-h-screen p-4">
      <div className="mb-6 p-4 bg-gray-900 rounded-lg flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="sortBy" className="text-white mr-2">Sort by:</label>
          <select 
            id="sortBy"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="sortOrder" className="text-white mr-2">Order:</label>
          <select 
            id="sortOrder"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="filterDate" className="text-white mr-2">Filter by date:</label>
          <input
            id="filterDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

function EventCard({ event }) {
  return (
    <Link href={`/events/${event._id}`}>
      <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors cursor-pointer">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-400 mb-2">{new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-400 mb-4">{event.location}</p>
        <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
        <p className="text-gray-400">Organized by: {event.organizer.firstName} {event.organizer.lastName}</p>
      </div>
    </Link>
  );
}