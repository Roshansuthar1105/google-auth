# MERN Authentication App with Google OAuth

A full-stack MERN (MongoDB, Express, React, Node.js) application with authentication features including:

- Email/password authentication
- Google OAuth authentication
- Password reset functionality
- User profile management
- Responsive UI with Tailwind CSS

## Project Structure

- **client**: React frontend with Tailwind CSS
- **server**: Node.js/Express backend with MongoDB

## Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Google OAuth credentials

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Google-Auth
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/google-auth-app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173

# Email configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASSWORD=your_email_password
FROM_NAME=Google Auth App
FROM_EMAIL=noreply@example.com
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Start the backend server:

```bash
cd server
npm run dev
```

#### Start the frontend development server:

```bash
cd client
npm run dev
```

The application will be available at http://localhost:5174

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:5000` and `http://localhost:5174`
6. Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your server `.env` file

## Features

- User registration and login
- Google OAuth authentication
- Password reset via email
- Protected routes
- User profile management
- Responsive design with Tailwind CSS

## Technologies Used

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Passport.js for Google OAuth
- Bcrypt for password hashing
- Nodemailer for sending emails

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- React Icons
