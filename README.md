
# Frontend

Welcome to the frontend part of our project! This README will guide you through the setup and running of the application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- Git

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/amarmurmu001/frontend.git
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
    cp .env.example .env.local
    ```
    Edit the `.env.local` file with your local configuration. Be sure to set:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm start`: Runs the built app in production mode
- `npm run lint`: Lints the codebase
- `npm test`: Runs the test suite

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` file for details on how to submit pull requests, report issues, and suggest improvements.

## Troubleshooting

If you encounter any issues during setup or running the application, please check our [Troubleshooting Guide](#) or open an issue on our GitHub repository.
