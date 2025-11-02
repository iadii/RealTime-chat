# Real-Time Chat Application

A full-stack real-time chat application built with Node.js (WebSocket) backend and React frontend.

## Features

- Real-time messaging using WebSocket
- User identification with usernames
- Message timestamps
- Connection status indicators
- Responsive design
- User tagging with @ mentions
- Auto-reconnect functionality

## Project Structure

```
.
├── backend/
│   └── src/
│       ├── controllers/     # Handles WebSocket and HTTP logic
│       ├── models/          # Data models (e.g., ChatModel)
│       ├── routes/          # API routes
│       ├── middleware/      # e.g., CORS
│       ├── utils/           # Utilities like logger
│       ├── config/          # Configuration files
│       └── server.js        # Entry point
├── frontend/
   └── src/
       ├── components/      # UI components (ChatInput, Messages, etc.)
       ├── hooks/           # Custom hooks (useWebSocket, useChat)
       ├── services/        # WebSocket connection service
       └── App.jsx          # Main component
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
   npm run dev
   ```
   The server will start on port 9001 (or next available port).

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on port 5173 (or next available port).

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## How It Works

### Backend

The backend is a Node.js server using:
- Express.js for HTTP handling
- WebSocket (ws library) for real-time communication

The server handles:
- WebSocket connections
- Broadcasting messages to all connected clients
- Managing user connections/disconnections
- User identification with usernames
- Message persistence (in-memory)

### Frontend

The frontend is a React application that:
- Establishes a WebSocket connection to the backend
- Allows users to set usernames
- Sends and receives chat messages in real-time
- Displays connection status
- Provides user tagging with @ mentions
- Implements auto-reconnect functionality

## WebSocket Message Types

1. **Chat Messages** (`type: 'chat'`) - Regular chat messages
2. **Join Notifications** (`type: 'join'`) - User joined notifications
3. **Leave Notifications** (`type: 'leave'`) - User left notifications
4. **Username Updates** (`type: 'username'`) - Username change notifications
5. **Info Messages** (`type: 'info'`) - System information messages
6. **User List** (`type: 'userList'`) - List of connected users for tagging

## Development

### Backend Development

For development with auto-restart:
```bash
cd backend
npm run dev
```

### Frontend Development

The frontend uses Vite with React for hot reloading:
```bash
cd frontend
npm run dev
```

### Code Structure

#### Backend
- `server.js` - Entry point that sets up Express server and WebSocket handling
- `controllers/WebSocketController.js` - Handles WebSocket events and message broadcasting
- `models/ChatModel.js` - Manages chat data and connected clients
- `middleware/corsMiddleware.js` - Handles CORS configuration

#### Frontend
- `App.jsx` - Main component that orchestrates the chat application
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks for WebSocket and chat functionality
- `services/` - WebSocket service for connection management

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:
1. The backend automatically tries the next available port (9002, 9003, etc.)
2. Update the frontend WebSocket connection URL in `App.jsx` to match the actual backend port
3. Or kill processes using the ports with `lsof -i :port` and `kill -9 PID`

### Connection Issues
- Ensure the backend server is running before starting the frontend
- Check that the WebSocket URL in the frontend matches the backend port
- Check browser console for WebSocket connection errors