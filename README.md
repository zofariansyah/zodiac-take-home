# Zodiac Task Manager

A modern, full-stack task management application featuring dual-mode operation (guest/authenticated), real-time search and filtering, optimistic updates, and a beautiful UI. Built with cutting-edge technologies for maximum performance and developer experience.

## 📸 Screenshots

> **Note**: Add your screenshots here after capturing them manually.

## 🎯 Project Overview

Zodiac Task Manager is a production-ready task management application that demonstrates modern web development best practices. It features a unique dual-mode architecture allowing users to start immediately without registration (guest mode with LocalStorage) or sign up for cloud-synced tasks (user mode with PostgreSQL). The application includes advanced features like real-time search, status filtering, multiple sort options, and optimistic UI updates powered by React Query.

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- **Framework**: [Elysia.js](https://elysiajs.com/) - Ergonomic web framework for Bun
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Reliable relational database
- **ORM**: [Prisma](https://www.prisma.io/) v5 - Type-safe database client
- **Authentication**: JWT + bcrypt - Secure token-based auth

### Frontend
- **Framework**: [React](https://react.dev/) 19 + TypeScript - Modern UI library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query) - Powerful async state management
- **Routing**: [React Router](https://reactrouter.com/) v7 - Client-side routing
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend tooling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ Guest Mode   │         │  User Mode   │                │
│  │ (LocalStorage)│        │  (API + DB)  │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         └────────┬───────────────┘                         │
│                  │                                         │
│         ┌────────▼─────────┐                               │
│         │  React Query     │ (Optimistic Updates)         │
│         │  Cache Layer     │                               │
│         └────────┬─────────┘                               │
│                  │                                         │
│         ┌────────▼─────────┐                               │
│         │   Dashboard      │                               │
│         │ Search/Filter    │                               │
│         │ Sort/CRUD        │                               │
│         └──────────────────┘                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                      SERVER SIDE                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Elysia.js API Server                    │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │   Auth      │  │    Tasks     │  │   CORS     │ │  │
│  │  │ /register   │  │ GET /tasks   │  │  Middleware│ │  │
│  │  │ /login      │  │ POST /tasks  │  └────────────┘ │  │
│  │  │ (JWT)       │  │ PUT /tasks   │                  │  │
│  │  └─────────────┘  │ DELETE /tasks│                  │  │
│  │                   │ (Protected)  │                  │  │
│  │                   └──────┬───────┘                  │  │
│  └──────────────────────────┼──────────────────────────┘  │
│                             │                              │
│                   ┌─────────▼─────────┐                    │
│                   │   Prisma ORM      │                    │
│                   │   (Type-safe)     │                    │
│                   └─────────┬─────────┘                    │
│                             │                              │
│                   ┌─────────▼─────────┐                    │
│                   │   PostgreSQL      │                    │
│                   │                   │                    │
│                   │  ┌─────────────┐  │                    │
│                   │  │ Users Table │  │                    │
│                   │  └─────────────┘  │                    │
│                   │  ┌─────────────┐  │                    │
│                   │  │ Tasks Table │  │                    │
│                   │  │ (Indexed)   │  │                    │
│                   │  └─────────────┘  │                    │
│                   └───────────────────┘                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Folder Structure

```
take-home-zodiac/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main server (API routes, search/filter/sort)
│   │   └── auth.ts               # Authentication logic (JWT + bcrypt)
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (User + Task models with indexes)
│   │   └── migrations/           # Database migrations
│   ├── test/
│   │   └── app.test.ts           # Unit tests (7 tests, all passing)
│   ├── .env.example              # Environment variables template
│   └── package.json              # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.tsx      # Task display with inline edit
│   │   │   └── TaskForm.tsx      # Task creation form
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # Main dashboard (React Query + filters)
│   │   │   ├── LoginPage.tsx     # Login page
│   │   │   └── RegisterPage.tsx  # Registration page
│   │   ├── __tests__/
│   │   │   ├── setup.ts          # Test configuration
│   │   │   └── api.test.ts       # Guest mode tests
│   │   ├── api.ts                # API client (dual-mode + filters)
│   │   ├── App.tsx               # Main app (React Query provider)
│   │   └── main.tsx              # Entry point
│   ├── vite.config.ts            # Vite configuration
│   └── package.json              # Frontend dependencies
│
└── README.md                      # This file
```

## 🚀 Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/) v1.0+
- [PostgreSQL](https://www.postgresql.org/) v12+

### 1. Clone & Install

```bash
git clone <repository-url>
cd take-home-zodiac

# Backend
cd backend
bun install

# Frontend
cd ../frontend
bun install
```

### 2. Configure Database

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-secret-key-here"
```

### 3. Run Migrations

```bash
cd backend
bunx prisma migrate dev
bunx prisma generate
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Frontend
cd frontend
bun run dev
```

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

## 📚 API Documentation

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
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
  "user": { "id": 1, "email": "user@example.com" }
}
```

### Tasks (Protected)

All task endpoints require: `Authorization: Bearer <token>`

#### Get Tasks (with filters)
```http
GET /tasks?search=meeting&status=active&sortBy=createdAt&order=desc
```

**Query Parameters:**
- `search` (optional): Search in title and description
- `status` (optional): `completed` | `active`
- `sortBy` (optional): `createdAt` | `title` | `updatedAt` (default: `createdAt`)
- `order` (optional): `asc` | `desc` (default: `desc`)

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "New task",
  "description": "Optional description"
}
```

#### Update Task
```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

## ✨ Features

### Core Features
- ✅ **Dual-Mode Operation**
  - Guest Mode: LocalStorage (no login)
  - User Mode: PostgreSQL (with login)
- ✅ **Full CRUD** operations
- ✅ **Authentication** (JWT + bcrypt)
- ✅ **Inline Task Editing**
- ✅ **Modern UI** with Tailwind CSS v4

### Advanced Features
- 🔍 **Real-time Search** (title + description)
- 📊 **Status Filtering** (All/Active/Completed)
- 🔄 **Multiple Sort Options** (Date/Title/Updated)
- ⚡ **Optimistic Updates** (React Query)
- 🗂️ **Database Indexing** (userId, completed, createdAt, title)
- 🧪 **Unit Tests** (Backend: 7/7 passing)

## 🧪 Testing

```bash
# Backend tests
cd backend
bun test

# Frontend tests
cd frontend
bun run test
```

## ⚖️ Trade-offs & Design Decisions

### 1. **Prisma v5 instead of v7**
- **Why**: Prisma v7 had compatibility issues with Bun runtime
- **Trade-off**: Missing latest features, but gained stability
- **Impact**: Production-ready, no runtime crashes

### 2. **Dual-Mode Architecture**
- **Why**: Reduce friction for new users, progressive enhancement
- **Trade-off**: More complex frontend logic (two storage strategies)
- **Impact**: Better UX, higher initial development cost

### 3. **LocalStorage for Guest Mode**
- **Why**: Zero server load, instant feedback, privacy
- **Trade-off**: Device-specific, no sync across devices
- **Impact**: Perfect for trying the app, encourages sign-up

### 4. **React Query for State Management**
- **Why**: Built-in caching, optimistic updates, automatic refetching
- **Trade-off**: Additional dependency, learning curve
- **Impact**: Significantly better UX, less boilerplate

### 5. **Database Indexing Strategy**
- **Why**: Optimize search and filter queries
- **Indexes**: `userId`, `completed`, `createdAt`, `title`
- **Trade-off**: Slightly slower writes, more storage
- **Impact**: Fast queries even with thousands of tasks

### 6. **Inline Edit vs Modal**
- **Why**: Fewer clicks, smoother UX
- **Trade-off**: More complex component state
- **Impact**: Better user experience, cleaner UI

### 7. **No Email Verification**
- **Why**: Requires external email service (SendGrid, etc.)
- **Trade-off**: Less secure, potential spam accounts
- **Impact**: Faster MVP, can be added later

### 8. **Case-Insensitive Search**
- **Why**: Better user experience
- **Trade-off**: Slightly slower queries (but mitigated by indexes)
- **Impact**: More intuitive search behavior

## 🔮 Future Enhancements

- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Task sharing between users
- [ ] Dark mode toggle
- [ ] Export tasks (CSV/JSON)
- [ ] Password reset via email
- [ ] Email verification
- [ ] Drag-and-drop task reordering
- [ ] Rich text descriptions (Markdown)
- [ ] File attachments

## 📄 License

MIT

---

**Built with ❤️ using Bun, Elysia, React, and PostgreSQL**
