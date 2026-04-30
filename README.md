# JobTracker

JobTracker is a full-stack web application for managing a personal job search. It lets users register, sign in, and track applications across different stages with a clean dashboard and protected API.

## Overview

This project was built as a pet project to practice:

- building a full-stack app with separate frontend and backend
- JWT-based authentication and protected routes
- Spring Security and REST API design
- database migrations with Flyway
- React state management, forms, filtering, and dashboard UI polish

## Features

- User registration and login
- JWT authentication with protected backend endpoints
- Protected frontend dashboard
- Add job applications with company, position, and status
- Filter applications by status
- Search applications by company name
- Paginate application results
- Delete applications with immediate UI refresh
- Track progress with `APPLIED`, `INTERVIEW`, `OFFER`, and `REJECTED` statuses

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Flyway
- PostgreSQL
- Maven

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- CSS

## Project Structure

```text
jobtracker/
├── src/main/java/...        # Spring Boot backend
├── src/main/resources/      # application config and Flyway migrations
├── src/test/java/...        # backend tests
├── jobtracker-frontend/     # React + TypeScript frontend
└── README.md
```

## Local Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd jobtracker
```

### 2. Start PostgreSQL

Create a PostgreSQL database named `jobtracker`.

The backend currently uses these local settings:

- host: `localhost`
- port: `5433`
- database: `jobtracker`
- username: `postgres`
- password: `postgres`

You can change them in `src/main/resources/application.properties`.

### 3. Run the backend

From the project root:

```bash
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 4. Run the frontend

From `jobtracker-frontend/`:

```bash
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

If your backend runs on a different URL, set:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Environment Notes

- The frontend currently uses Vite 8, which requires Node `20.19+` or `22.12+`.
- The backend is configured for Java 21 target compatibility.
- Flyway runs automatically on backend startup.
- CORS is enabled for local frontend development on `localhost` and `127.0.0.1`.

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Companies

- `POST /api/companies`
- `GET /api/companies/my`
- `GET /api/companies/{id}`
- `DELETE /api/companies/{id}`

## Running Tests

### Backend

```bash
./mvnw test
```

### Frontend type check

```bash
cd jobtracker-frontend
npx tsc -b
```

## What I Improved In This Version

- moved Spring config into the standard resources location
- aligned the backend build with Java 21
- fixed frontend/backend CORS integration
- improved registration and login error handling
- upgraded the dashboard UI and responsive layout
- fixed delete so the list refreshes immediately after removing an item

## Possible Next Improvements

- edit existing applications
- add integration tests for auth and company flows
- deploy frontend and backend
- add screenshots or a short demo GIF
- support notes, links, or interview dates for each application
