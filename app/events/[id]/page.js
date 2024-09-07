'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '../../utils/api';

export default function EventDetails({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails(params.id);
  }, [params.id]);

  const fetchEventDetails = async (id) => {
    try {
      const data = await fetchApi(`/api/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to fetch event details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading event details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!event) return <div className="text-white">Event not found</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-black rounded-lg shadow-md border border-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-white">{event.title}</h1>
      <p className="text-gray-400 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-400 mb-4">Location: {event.location}</p>
      <p className="text-gray-300 mb-6">{event.description}</p>
      <p className="text-gray-400">Organized by: {event.organizer.firstName} {event.organizer.lastName}</p>
    </div>
  );
}