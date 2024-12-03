'use client';

import React, { useState } from 'react';
import { api } from '../utils/api';
import Toast from '../components/Toast'; // Make sure you have this component

export default function CreateEventForm({ onClose, onEventCreated }) {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    registrationLink: '', // Add this line
    maxAttendees: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Submitting event data:', eventData); // Add this log
      const createdEvent = await api.events.createEvent(eventData);
      console.log('Event created:', createdEvent);
      onEventCreated();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 border border-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-300 mb-2">Maximum Attendees</label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={eventData.maxAttendees}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-500 transition-all resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-300 mb-2">Registration Link (optional)</label>
            <input
              type="url"
              id="registrationLink"
              name="registrationLink"
              value={eventData.registrationLink}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-500 transition-all"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white 
                bg-black/50 border border-gray-800 rounded-lg hover:border-gray-600 
                transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-black bg-white 
                rounded-lg hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-white
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
      {showToast && (
        <Toast
          message="Event created successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}