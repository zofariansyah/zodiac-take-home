# Task Management Application

A modern, full-stack task management application built with **Bun**, **Elysia.js**, **React**, **TypeScript**, and **PostgreSQL**.

## Features

- ✅ **Dual Mode Operation**
  - **Guest Mode**: Tasks stored in browser LocalStorage (no login required)
  - **User Mode**: Tasks synced to PostgreSQL database (requires login)
- 🔐 **Authentication**: JWT-based login/register system
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Bun for blazing-fast performance
- 🧪 **Tested**: Unit tests for backend and frontend

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT + bcrypt

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Build Tool**: Vite

## Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [PostgreSQL](https://www.postgresql.org/) v12+
- Node.js v18+ (for some tooling)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd take-home-zodiac
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL connection string
```

**Example `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-secret-key-here"
```

```bash
# Run database migrations
bunx prisma migrate dev

# Generate Prisma Client
bunx prisma generate

# Start the backend server
bun run src/index.ts
```

The API will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Task Endpoints

All task endpoints require authentication via `Authorization: Bearer <token>` header.

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task manager",
    "completed": false,
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z",
    "userId": 1
  }
]
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New task",
  "description": "Optional description",
  "completed": false
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

## Running Tests

### Backend Tests
```bash
cd backend
bun test
```

### Frontend Tests
```bash
cd frontend
bun run test
```

## Project Structure

```
take-home-zodiac/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   └── auth.ts           # Authentication logic
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Database migrations
│   ├── test/                 # Unit tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context (Auth)
│   │   ├── pages/            # Page components
│   │   ├── api.ts            # API client
│   │   └── App.tsx           # Main app component
│   ├── __tests__/            # Unit tests
│   └── package.json
└── README.md
```

## Usage

### Guest Mode
1. Open the app at `http://localhost:5173`
2. Start creating tasks immediately
3. Tasks are saved in your browser's LocalStorage

### User Mode
1. Click "Sign Up" to create an account
2. Login with your credentials
3. Tasks are now saved to the database
4. Access your tasks from any device

## Development

### Database Management

```bash
# Create a new migration
bunx prisma migrate dev --name migration_name

# Reset database
bunx prisma migrate reset

# Open Prisma Studio (GUI)
bunx prisma studio
```

### Build for Production

```bash
# Backend (no build needed, run directly with Bun)
cd backend
bun run src/index.ts

# Frontend
cd frontend
bun run build
bun run preview
```

## License

MIT
