# Project & Task Management API

A secure RESTful API for managing projects and tasks with user authentication and authorization.

## Tech Stack

- **Runtime**: Node.js 24
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## Prerequisites

- Node.js 24+
- PostgreSQL 18+
- pnpm (package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ahMEDhat-7/project-task-api.git
cd project-task-api
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials and JWT secret.

## Development

Start the development server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## Docker

Run with Docker Compose:
```bash
docker compose up -d
```

This will start:
- API server on port 3000
- PostgreSQL on port 5432

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/docs
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm seed` | Seed database with sample data |

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

### Projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - Get all projects (paginated)
- `GET /api/v1/projects/:id` - Get project by ID
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project (soft delete)

### Tasks
- `POST /api/v1/projects/:projectId/tasks` - Create task in project
- `GET /api/v1/projects/:projectId/tasks` - Get tasks by project
- `GET /api/v1/tasks` - Get all tasks with filtering
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## Project Structure

```
src/
├── config/           # Configuration files
├── database/         # Migrations and seeds
├── modules/          # Feature modules
│   ├── auth/        # Authentication
│   ├── users/       # User entity
│   ├── projects/    # Projects CRUD
│   └── tasks/       # Tasks CRUD
├── middleware/        # Express middleware
├── common/           # Shared utilities
│   ├── errors/      # Custom error classes
│   ├── validators/  # Zod schemas
│   └── utils/       # Helper functions
├── docs/            # Swagger configuration
├── routes/          # Route registry
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Testing

Run all tests:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## License

ISC
