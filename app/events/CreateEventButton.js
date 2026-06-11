'use client';

import React from 'react';
import CreateEventForm from './CreateEventForm';

export default function CreateEventButton({ onEventCreated, onClose }) {
  return (
    <CreateEventForm
      onClose={onClose}
      onEventCreated={onEventCreated}
    />
  );
}
