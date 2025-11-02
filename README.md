# Real-Time Chat Application

A full-stack real-time chat application built with Node.js (WebSocket) backend and React frontend.

## Features

- Real-time messaging using WebSocket
- User identification with usernames
- Message timestamps
- Connection status indicators
- Responsive design

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   └── server.js    # WebSocket server implementation
│   └── package.json     # Backend dependencies
└── frontend/
    ├── src/
    │   ├── App.js       # Main chat component
    │   └── App.css      # Styling
    └── package.json     # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   The server will start on port 8080.

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will start on port 3000.

3. Open your browser and navigate to `http://localhost:3000`

## How It Works

### Backend

The backend is a Node.js server using:
- Express.js for HTTP handling
- WebSocket (ws library) for real-time communication

The server handles:
- WebSocket connections
- Broadcasting messages to all connected clients
- Managing user connections/disconnections

### Frontend

The frontend is a React application that:
- Establishes a WebSocket connection to the backend
- Allows users to set usernames
- Sends and receives chat messages in real-time
- Displays connection status

## WebSocket Message Types

1. **Chat Messages** (`type: 'chat'`) - Regular chat messages
2. **Join Notifications** (`type: 'join'`) - User joined notifications
3. **Leave Notifications** (`type: 'leave'`) - User left notifications
4. **Username Updates** (`type: 'username'`) - Username change notifications
5. **Info Messages** (`type: 'info'`) - System information messages

## Development

### Backend Development

For development with auto-restart:
```bash
cd backend
npm run dev
```

### Frontend Development

The frontend uses Create React App with hot reloading:
```bash
cd frontend
npm start
```