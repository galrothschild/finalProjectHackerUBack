Based on the provided information, here's a draft of the `README.md` for your backend:

---

# MERN App Backend

This repository contains the backend code for a MERN stack application that interacts with the TMDB API. It fetches, normalizes, and stores movie and TV show data, as well as manages user authentication and authorization.

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Features](#features)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Error Handling](#error-handling)
8. [Documentation](#documentation)

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB with Mongoose**
- **JWT for authentication**
- **bcrypt for password hashing**
- **winston for logging**
- **cors for handling cross-origin requests**
- **zod for schema validation**

## Features

- **User Management:**
  - Create, modify, and delete users
  - Login functionality with JWT authentication
  - Refresh tokens stored in cookies
  - Admin users can delete and update users
  - User roles: normal user and admin

- **Movie and TV Show Management:**
  - Fetch and normalize data from TMDB API
  - Store movies and TV shows in the database
  - Search and browse movies and TV shows
  - Users can add items to their watchlist or mark them as watched
  - View user-specific watchlists and watched lists

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/galrothschild/finalProjectHackerUBack
   ```
2. Navigate to the project directory:
   ```sh
   cd finalProjectHackerUBack
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Environment Variables

Ensure the following environment variables are set in a `.env` file:

- `PORT`: The port number on which the server will run (e.g., `3000`).
- `API_READ_TOKEN`: Token for reading data from TMDB.
- `TMDB_API_URL`: Base URL for the TMDB API (e.g., `https://api.themoviedb.org/3`).
- `TOKEN_SECRET`: Secret key for JWT token encryption.
- `REFRESH_TOKEN_SECRET`: Secret key for JWT refresh token encryption.
- `LOG_LEVEL`: Logging level for Winston (e.g., `debug`).

## Project Structure

```
├── auth
│   └── Providers
├── credits
│   ├── data
│   └── routes
├── db
│   └── mongodb
├── initialData
├── movies
│   ├── data
│   └── routes
├── router
├── tmdb
├── tv
│   ├── data
│   └── routes
├── users
│   ├── data
│   ├── routes
│   ├── utils
│   └── validation
│       └── zod
└── utils
    └── logger
```

## Usage

- **User Authentication:** 
  - Login and receive JWT tokens
  - Access protected routes based on user roles

- **Movie and TV Show Data:** 
  - Automatically fetch and store data from TMDB API if not present in the database
  - Browse and search for movies and TV shows
  - Manage watchlists and watched lists for users

## Error Handling

- All errors are logged using Winston.
- Error handler middleware catches and handles errors gracefully.

## Documentation

Full API documentation is available on [Postman](https://documenter.getpostman.com/view/34926651/2sA3rwMZxU).
