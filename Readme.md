# EV Charging Station System

A full-stack application for managing electric vehicle charging stations with user authentication, CRUD operations, and interactive map view.

## Installation

clone the repository

```bash
git clone https://github.com/Bhumeshwar2002/EV_Charging_Stations
cd ev-charging-system
```

## Backend Setup

```bash
cd backend
npm install
```

## .env

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/charging_stations
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=30d
```

## Frontend Setup

```bash
cd ../frontend
npm install
```

## .env

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## Start the Development server

```bash
npm run dev
```
