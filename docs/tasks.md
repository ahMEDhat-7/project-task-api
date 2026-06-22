# Backend Development Tasks

## Phase 1 – Project Initialization

### Task 1.1

Initialize project

- pnpm init
- TypeScript setup
- ESLint
- Prettier

### Task 1.2

Install dependencies

Core:

- express
- typeorm
- pg
- dotenv

Security:

- jsonwebtoken
- bcrypt
- helmet
- cors
- express-rate-limit

Validation:

- zod

Docs:

- swagger-ui-express
- swagger-jsdoc

Development:

- ts-node-dev
- jest
- supertest

---

## Phase 2 – Architecture Setup

### Task 2.1

Create folder structure

src/

- config
- modules
- middleware
- routes
- utils
- docs
- database

---

### Task 2.2

Configure environment variables

- PORT
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET

---

### Task 2.3

Configure TypeORM

- DataSource
- PostgreSQL connection
- Migration setup

---

## Phase 3 – Database Layer

### Task 3.1

Create User Entity

Fields:

- id
- name
- email
- password
- role

---

### Task 3.2

Create Project Entity

Fields:

- id
- title
- description
- status
- ownerId

---

### Task 3.3

Create Task Entity

Fields:

- id
- title
- description
- status
- priority
- dueDate
- projectId

---

### Task 3.4

Generate migrations

- users table
- projects table
- tasks table

---

### Task 3.5

Create seed scripts

- admin user
- sample projects
- sample tasks

---

## Phase 4 – Authentication Module

### Task 4.1

Register Endpoint

POST /auth/register

---

### Task 4.2

Login Endpoint

POST /auth/login

---

### Task 4.3

JWT Middleware

- Verify token
- Attach user

---

### Task 4.4

Profile Endpoint

GET /auth/me

---

## Phase 5 – Projects Module

### Task 5.1

Create Project

POST /projects

---

### Task 5.2

Get User Projects

GET /projects

Pagination:

- page
- limit

Sorting:

- createdAt
- title

---

### Task 5.3

Get Project By ID

GET /projects/:id

Authorization check

---

### Task 5.4

Update Project

PUT /projects/:id

---

### Task 5.5

Delete Project

DELETE /projects/:id

Soft delete

---

## Phase 6 – Tasks Module

### Task 6.1

Create Task

POST /projects/:projectId/tasks

---

### Task 6.2

Get Tasks

GET /projects/:projectId/tasks

Pagination

Sorting

Filtering

---

### Task 6.3

Get Task By ID

GET /tasks/:id

---

### Task 6.4

Update Task

PUT /tasks/:id

---

### Task 6.5

Delete Task

DELETE /tasks/:id

---

### Task 6.6

Filter Tasks

GET /tasks

Filters:

- status
- priority
- dueDate

---

## Phase 7 – Validation

### Task 7.1

Auth DTO Validation

- register
- login

---

### Task 7.2

Project DTO Validation

- create
- update

---

### Task 7.3

Task DTO Validation

- create
- update

---

## Phase 8 – Error Handling

### Task 8.1

Global Error Middleware

---

### Task 8.2

Custom Error Classes

- BadRequest
- Unauthorized
- Forbidden
- NotFound

---

### Task 8.3

Centralized Response Format

Success:

{
success: true,
data: {}
}

Error:

{
success: false,
message: ""
}

---

## Phase 9 – API Documentation

### Task 9.1

Swagger Setup

---

### Task 9.2

Document Authentication APIs

---

### Task 9.3

Document Project APIs

---

### Task 9.4

Document Task APIs

---

## Phase 10 – Docker

### Task 10.1

Create Dockerfile

---

### Task 10.2

Create docker-compose.yml

Services:

- api
- postgres

---

### Task 10.3

Volume configuration

---

## Phase 11 – Testing

### Task 11.1

Unit Tests

Auth

Project

Task

---

### Task 11.2

Integration Tests

Authentication Flow

Project CRUD

Task CRUD

---

## Phase 12 – Documentation

### Task 12.1

Create README.md

Include:

- Setup
- Scripts
- Docker usage
- API documentation

---

### Task 12.2

Create .env.example

---

## Definition of Done

- All endpoints functional
- JWT authentication implemented
- PostgreSQL integrated
- TypeORM migrations working
- Swagger available
- Docker working
- Tests passing
- Lint passing
- README completed
- Production-ready folder structure
