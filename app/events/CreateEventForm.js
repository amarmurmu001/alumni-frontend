'use client';

import React, { useState } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';

export default function CreateEventForm({ onClose, onEventCreated }) {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    registrationLink: '',
    maxAttendees: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const createdEvent = await api.events.createEvent(eventData);
      onEventCreated(createdEvent);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-white placeholder-gray-500 transition-all";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className={labelClasses}>Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className={inputClasses}
            required
            placeholder="e.g. Annual Alumni Meetup"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={labelClasses}>Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className={labelClasses}>Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className={inputClasses}
              required
              placeholder="e.g. Main Auditorium"
            />
          </div>
        </div>
        <div>
          <label htmlFor="maxAttendees" className={labelClasses}>Maximum Attendees</label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={eventData.maxAttendees}
            onChange={handleChange}
            className={inputClasses}
            placeholder="e.g. 100"
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            rows="4"
            className={`${inputClasses} resize-none`}
            required
            placeholder="Describe the event, schedule, and any special instructions..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="registrationLink" className={labelClasses}>Registration Link (optional)</label>
          <input
            type="url"
            id="registrationLink"
            name="registrationLink"
            value={eventData.registrationLink}
            onChange={handleChange}
            className={inputClasses}
            placeholder="https://forms.google.com/..."
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></span>
              Creating...
            </span>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
}
