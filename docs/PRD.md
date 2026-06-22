# Project Requirements Document (PRD)

## Project Name

Project & Task Management API

---

# 1. Overview

Build a secure RESTful API that allows authenticated users to manage projects and tasks.

The system provides:

- User authentication and authorization
- Project management
- Task management
- Filtering, pagination, and sorting
- API documentation
- Dockerized deployment

---

# 2. Goals

### Business Goals

- Provide a centralized project tracking system.
- Allow users to organize tasks under projects.
- Enable project progress tracking.

### Technical Goals

- Clean architecture.
- Scalable codebase.
- Secure authentication.
- Production-ready deployment.

---

# 3. Tech Stack

| Category               | Technology      |
| ---------------------- | --------------- |
| Runtime                | Node.js 24      |
| Language               | TypeScript (strict, decorators) |
| Framework              | Express.js 5    |
| Database               | PostgreSQL 18   |
| ORM                    | TypeORM         |
| Authentication         | JWT (HS256, algorithm-pinned) |
| Password Hashing       | bcrypt          |
| Validation             | Zod v4          |
| Documentation          | Swagger/OpenAPI |
| Containerization       | Docker (multi-stage, Alpine) |
| Testing                | Jest            |
| Linting                | ESLint v9 (flat config) |
| Logging                | Winston         |
| Environment Management | dotenv + Zod    |

---



# 4. User Roles

## Member

Can:

- Register
- Login
- Create projects
- Manage own projects
- Manage own tasks

## Admin

Can:

- View all projects
- View all users
- Manage all tasks

---

# 5. Functional Requirements

## Authentication Module

### Register

POST /api/v1/auth/register

Input:

- name
- email
- password

Output:

- user information
- JWT token

Validation:

- email unique
- password min 8 chars
- password must contain uppercase, lowercase, digit, and special character

---

### Login

POST /api/v1/auth/login

Input:

- email
- password

Output:

- JWT token

---

### Profile

GET /api/v1/auth/me

Requires JWT

Returns current user.

---

## Projects Module

### Create Project

POST /api/v1/projects

Fields:

- title
- description
- status

Status values:

- Active
- Completed
- Archived

---

### Get Projects

GET /api/v1/projects

Features:

- Pagination
- Sorting
- Search

---

### Get Project By Id

GET /api/v1/projects/:id

---

### Update Project

PUT /api/v1/projects/:id

---

### Delete Project

DELETE /api/v1/projects/:id

Soft delete preferred.

---

## Tasks Module

### Create Task

POST /api/v1/projects/:projectId/tasks

Fields:

- title
- description
- status
- priority
- dueDate

Status:

- Pending
- InProgress
- Done

Priority:

- Low
- Medium
- High

---

### Get Tasks

GET /api/v1/projects/:projectId/tasks

Supports:

- Pagination
- Sorting
- Filtering

---

### Get Task By Id

GET /api/v1/tasks/:id

---

### Update Task

PUT /api/v1/tasks/:id

---

### Delete Task

DELETE /api/v1/tasks/:id

---

### Filter Tasks

GET /api/v1/tasks

Query Parameters:

- status
- priority
- dueDate
- page
- limit

---

# 6. Non-Functional Requirements

## Security

- JWT authentication with HS256 algorithm pinning
- bcrypt password hashing (configurable salt rounds)
- Helmet with HSTS (max-age: 1 year)
- CORS protection (configurable allowed origins)
- Rate limiting (global + auth-specific: 5 attempts/15min)
- Body size limit (10KB max)
- Input validation with Zod `.strict()` schemas
- SQL injection prevention (whitelist-based ORDER BY)
- Mass assignment prevention (explicit field whitelists)
- IDOR prevention (ownership verification on resource access)
- Generic error messages in production
- Auth event logging (login success/failure, registration, token errors)
- Swagger UI disabled in production
- Secrets via env_file, not hardcoded in Docker Compose

---

## Performance

- Database indexes
- Pagination
- Query optimization

---

## Maintainability

- Layered architecture
- TypeScript strict mode
- Reusable services
- Centralized error handling

---

# 7. Database Design

## Users

| Column    | Type      |
| --------- | --------- |
| id        | UUID      |
| name      | varchar   |
| email     | varchar   |
| password  | varchar   |
| role      | enum      |
| createdAt | timestamp |
| updatedAt | timestamp |

---

## Projects

| Column      | Type      |
| ----------- | --------- |
| id          | UUID      |
| title       | varchar   |
| description | text      |
| status      | enum      |
| ownerId     | UUID      |
| createdAt   | timestamp |
| updatedAt   | timestamp |
| deletedAt   | timestamp |

Relationship:

User 1 -> N Projects

---

## Tasks

| Column      | Type      |
| ----------- | --------- |
| id          | UUID      |
| title       | varchar   |
| description | text      |
| status      | enum      |
| priority    | enum      |
| dueDate     | timestamp |
| projectId   | UUID      |
| createdAt   | timestamp |
| updatedAt   | timestamp |

Relationship:

Project 1 -> N Tasks

---

# 8. API Documentation

Swagger available at:

/docs

Must include:

- Authentication endpoints
- Projects endpoints
- Tasks endpoints
- Request examples
- Response examples

---

# 9. Docker Requirements

Containers:

1. api
2. postgres

Docker Compose should support:

docker compose up -d

---

# 10. Testing

Unit Tests:

- Auth Service
- Project Service
- Task Service

Integration Tests:

- Authentication flow
- Project CRUD
- Task CRUD

Target Coverage:

Minimum 80%

---

# 11. Deliverables

- Source code
- Docker configuration
- Swagger documentation
- README.md
- .env.example
- Database migrations
- Seed scripts
- Test suite


---

# 12. Recommended Folder Structure

src/
├── config/
├── database/
│   ├── migrations/
│   └── seeds/
├── modules/
│   ├── auth/
│   │   └── __tests__/
│   ├── users/
│   ├── projects/
│   │   └── __tests__/
│   └── tasks/
│       └── __tests__/
├── middleware/
├── common/
│   ├── constants/
│   ├── errors/
│   ├── validators/
│   └── utils/
├── docs/
├── routes/
├── app.ts
└── server.ts