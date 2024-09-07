'use client';

import { useState } from 'react';
import CreateEventButton from './CreateEventButton';
import EventList from './EventList';

export default function Events() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center px-8 py-16">
        <section className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-400 mb-8">Discover and participate in alumni events, reunions, and networking opportunities</p>
          <CreateEventButton onEventCreated={handleEventCreated} />
        </section>

        <EventList key={refreshKey} />
      </main>
    </div>
  );
}