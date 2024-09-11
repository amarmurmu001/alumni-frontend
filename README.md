# Frontend

This is the frontend part of our project.

## Prerequisites

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- Git

## Setup

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/your-organization/your-project.git
   cd your-project
   ```

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp  .env.local
   ```
   Edit the `.env.local` file with your local configuration.

   NEXT_PUBLIC_API_URL=http://localhost:5000/api


## Running the application

To start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`.
```bash