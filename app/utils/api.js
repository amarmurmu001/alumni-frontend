const api = {
  jobs: {
    createJob: async (jobData) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      return response.json();
    },
    getJobs: async () => {
      const response = await fetch('/api/jobs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    },
  },
  // ... other API methods
};

export default api;