# Zodiac TaskFlow

A modern, full-stack task management application featuring dual-mode operation (guest/authenticated), real-time search and filtering, optimistic updates, and a beautiful UI. Built with cutting-edge technologies for maximum performance and developer experience.

## 📸 Screenshots

> <img width="1607" height="994" alt="image" src="https://github.com/user-attachments/assets/7e0fcc70-c507-43d4-a111-7a31ca8e9a53" />


## 🎯 Project Overview

Zodiac TaskFlow is a **production-ready** task management application that demonstrates modern web development best practices. It features a unique dual-mode architecture allowing users to start immediately without registration (guest mode with LocalStorage) or sign up for cloud-synced tasks (user mode with PostgreSQL).

### ✨ Key Features

**Core Functionality:**
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Dual-Mode Architecture** - Guest (LocalStorage) & User (Database) modes
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Inline Task Editing** - Edit tasks directly without modals

**Advanced Features:**
- ✅ **Search** - Real-time search across title and description
- ✅ **Filter** - Filter by status (All/Active/Completed)
- ✅ **Sort** - Multiple sort options (Date/Title/Updated, Asc/Desc)
- ✅ **Pagination** - Server-side pagination (10 items per page)
- ✅ **Optimistic Updates** - Instant UI feedback with React Query
- ✅ **Database Indexing** - Optimized queries for performance

**Developer Experience:**
- ✅ **Layered Architecture** - Clean separation (Controller → Service → Repository)
- ✅ **Request Validation** - Schema-based validation with Elysia
- ✅ **Error Handling** - Structured error responses
- ✅ **Unit Tests** - 7/7 backend tests passing
- ✅ **Docker Support** - One-command deployment
- ✅ **Standard API Response** - Consistent response format
- ✅ **TypeScript** - Full type safety across the stack

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
│   │   ├── controllers/         # HTTP request handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── services/            # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── repositories/        # Database access layer
│   │   │   └── index.ts
│   │   ├── schemas/             # Request validation schemas
│   │   │   └── index.ts
│   │   ├── utils/               # Utilities
│   │   │   ├── env.ts           # Environment config
│   │   │   ├── errors.ts        # Error classes
│   │   │   └── response.ts      # Standard API response
│   │   └── index.ts             # Main server entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (with indexes)
│   │   └── migrations/          # Database migrations
│   ├── test/
│   │   └── app.test.ts          # Unit tests (7 tests, all passing)
│   ├── .env.example             # Environment variables template
│   └── package.json             # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.tsx     # Task display with inline edit
│   │   │   └── TaskForm.tsx     # Task creation form
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Main dashboard (React Query + filters)
│   │   │   ├── LoginPage.tsx    # Login page
│   │   │   └── RegisterPage.tsx # Registration page
│   │   ├── __tests__/
│   │   │   ├── setup.ts         # Test configuration
│   │   │   └── api.test.ts      # Guest mode tests
│   │   ├── api.ts               # API client (dual-mode + filters)
│   │   ├── App.tsx              # Main app (React Query provider)
│   │   └── main.tsx             # Entry point
│   ├── vite.config.ts           # Vite configuration
│   └── package.json             # Frontend dependencies
│

# Backend
cd backend
bun install

# Frontend
cd ../frontend
bun install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run Migrations

```bash
cd backend
bunx prisma migrate dev
bunx prisma generate
```

### 4. Start Development Servers

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

---

## 🐳 Docker Deployment (Recommended)

The easiest way to run the entire stack with one command!

### Prerequisites
- [Docker](https://www.docker.com/get-started) v20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### Quick Start

**Option 1: Using deployment script (Linux/Mac)**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Option 2: Using Docker Compose directly**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data (clean slate)
docker-compose down -v
```

### What's Included in Docker Setup

The Docker Compose stack includes:
- ✅ **PostgreSQL** database (port 5432)
- ✅ **Backend API** (port 3000)
- ✅ **Frontend** served by nginx (port 80)
- ✅ **Automatic database migrations**
- ✅ **Health checks** for all services
- ✅ **Volume persistence** for database
- ✅ **Optimized multi-stage builds**

### Access the Application

Once deployed, access:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432 (postgres/postgres)

### Environment Configuration

Default credentials (change for production):
```yaml
Database:
  User: postgres
  Password: postgres
  Database: taskmanager

JWT:
  Secret: your-super-secret-jwt-key-change-in-production
```

To customize, edit `docker-compose.yml`:
```yaml
backend:
  environment:
    DATABASE_URL: postgresql://user:pass@db:5432/dbname
    JWT_SECRET: your-secret-here
    PORT: 3000
```

### Docker Commands Reference

```bash
# Start services
docker-compose up -d

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Stop all services
docker-compose down

# Remove all data and start fresh
docker-compose down -v
docker-compose up -d

# Access backend shell
docker-compose exec backend sh

# Run migrations manually
docker-compose exec backend bunx prisma migrate deploy

# Check service status
docker-compose ps
```

### Production Deployment

For production environments:

1. **Update secrets in `docker-compose.yml`:**
   ```yaml
   JWT_SECRET: <generate-strong-random-string>
   POSTGRES_PASSWORD: <strong-password>
   ```

2. **Update API URL for frontend:**
   ```yaml
   frontend:
     build:
       args:
         VITE_API_URL: https://api.yourdomain.com
   ```

3. **Add SSL/TLS:**
   - Use a reverse proxy (nginx, traefik, caddy)
   - Configure SSL certificates (Let's Encrypt)

4. **Security best practices:**
   - Don't expose database port publicly
   - Use Docker secrets for sensitive data
   - Enable firewall rules
   - Regular security updates

---

## 🧪 Testing

```bash
# Backend tests
cd backend
bun test

# Frontend tests
cd frontend
bun run test
```

---

## 📘 API Documentation

Semua respons mengikuti format standar dari `backend/src/utils/response.ts:8`:

```json
{ "success": true|false, "message": "...", "data": <payload> }
```

### Auth

- `POST /auth/register`
  - Body: `{ "email": string, "password": string(min 6) }`
  - 201, Data: `{ "id": number, "email": string }`

- `POST /auth/login`
  - Body: `{ "email": string, "password": string }`
  - 200, Data: `{ "token": string, "user": { "id": number, "email": string } }`

Contoh:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Tasks (Protected)

Header wajib: `Authorization: Bearer <token>`

- `GET /tasks`
  - Query: `search?`, `status?`(`completed|active`), `sortBy?`(`createdAt|title|updatedAt`), `order?`(`asc|desc`), `page?`(number), `limit?`(number)
  - 200, Data: `{ "tasks": Task[], "pagination": { page, limit, total, totalPages } }`

- `POST /tasks`
  - Body: `{ "title": string(1..255), "description?": string|null, "completed?": boolean }`
  - 201, Data: `Task`

- `PUT /tasks/:id`
  - Body: `{ "title?": string, "description?": string|null, "completed?": boolean }`
  - 200, Data: `Task`

- `DELETE /tasks/:id`
  - 200, Data: `null`

Contoh:

```bash
# Ambil daftar tugas (dengan filter & pagination)
curl "http://localhost:3000/tasks?search=fix&status=active&sortBy=createdAt&order=desc&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Buat tugas baru
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","description":"API section"}'

# Perbarui tugas
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Hapus tugas
curl -X DELETE http://localhost:3000/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

Skema validasi permintaan berada di `backend/src/schemas/index.ts:4` (auth) dan `backend/src/schemas/index.ts:15` (tasks). Proteksi JWT diterapkan melalui derivasi `userId` di `backend/src/index.ts:17` dan dipakai di controller `backend/src/controllers/task.controller.ts:10`.

---

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
