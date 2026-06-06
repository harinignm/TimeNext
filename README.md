# TimeNext 🌌

A futuristic digital time capsule platform where you can preserve memories and deliver them to the future.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose)
- **Auth**: JWT, Bcrypt
- **Image Handling**: Base64

## Features
- **Time-Locked Capsules**: Content remains hidden until the exact opening date and time.
- **Glassmorphism UI**: Modern, sleek interface with glowing effects and animated starfields.
- **Secure Storage**: Password-hashed accounts and optional capsule-level password protection.
- **Real-time Countdown**: Dynamic timers for locked capsules in your Vault.
- **WhatsApp Integration**: Easily share your capsule links with friends.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```
Start the server:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Folder Structure
- `server/`: Express API, Mongoose models, and auth middleware.
- `client/`: Vite + React application, Tailwind config, and UI components.
- `client/src/pages/`: Main application views (Home, Vault, Create, etc.).
- `client/src/context/`: Authentication state management.
