# Project & Task Management API

A secure RESTful API for managing projects and tasks with user authentication, authorization, and role-based access control.

## Tech Stack

- **Runtime**: Node.js 24
- **Language**: TypeScript (strict mode, decorators)
- **Framework**: Express.js 5
- **Database**: PostgreSQL 18
- **ORM**: TypeORM
- **Authentication**: JWT (HS256, algorithm-pinned)
- **Validation**: Zod v4
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker (multi-stage build, Alpine)
- **Testing**: Jest
- **Linting**: ESLint v9 (flat config)

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

4. Edit `.env` with your database credentials and JWT secret (minimum 32 characters).

## Development

Start the development server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3000` (configurable via `APP_URL`).

## Docker

Run with Docker Compose:
```bash
docker compose up -d
```

This will start:
- API server on port 3000
- PostgreSQL 18 on port 5432

Secrets (DB credentials, JWT secret) are read from `.env` via `env_file`, not hardcoded in compose.

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/docs
```

> **Note:** Swagger UI is only enabled in non-production environments.

## Health Check

```bash
GET /health
```

Returns:
```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (ts-node-dev) |
| `pnpm build` | Build for production (tsc) |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:integration` | Run integration tests (requires PostgreSQL) |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm seed` | Seed database with sample data |
| `pnpm migration:generate <path>` | Generate migration from entity changes |
| `pnpm migration:run` | Run pending migrations |
| `pnpm migration:revert` | Revert last migration |

## Database Migrations

### Development
In development, TypeORM automatically syncs your entity changes to the database using `synchronize: true`. No manual migration step required.

### Generating Migrations
When you make entity changes and want to persist them as a migration:

1. Build the project:
```bash
pnpm build
```

2. Generate the migration (requires a clean database for initial migration):
```bash
pnpm migration:generate src/database/migrations/DescriptiveName
```

3. For subsequent migrations, the database should have the current schema. The migration generator creates a diff between your entities and the existing database.

### Production
In production (`NODE_ENV=production`), TypeORM automatically runs pending migrations on server startup via `migrationsRun: true`.

## Production Deployment

### Using Docker Compose (Recommended)
```bash
docker compose up -d
```

This starts both the API server and PostgreSQL with migrations auto-applied.

### Manual Deployment
```bash
# Build the project
pnpm build

# Start production server (migrations run automatically)
NODE_ENV=production pnpm start
```

### Environment Variables
Ensure the following are set in production:
- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (minimum 32 characters)
- `CORS_ORIGINS` (comma-separated allowed origins)

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
├── config/             # Configuration (env validation, data source)
├── database/           # Migrations and seeds
│   └── seeds/          # Seed script
├── modules/            # Feature modules (domain-driven)
│   ├── auth/           # Authentication (register, login, JWT)
│   │   └── __tests__/  # Unit tests
│   ├── users/          # User entity + repository
│   ├── projects/       # Projects CRUD + ownership checks
│   │   └── __tests__/  # Unit tests
│   └── tasks/          # Tasks CRUD + ownership checks
│       └── __tests__/  # Unit tests
├── middleware/          # Express middleware
│   ├── auth.middleware.ts       # JWT verification
│   ├── authorize.middleware.ts  # Role-based access
│   ├── error.middleware.ts      # Global error handler
│   └── validate.middleware.ts   # Zod validation
├── common/             # Shared code
│   ├── constants/      # Validation constants
│   ├── errors/         # Custom error classes
│   ├── validators/     # Zod schemas
│   └── utils/          # Helpers (asyncWrapper, jwt, logger, pagination, response)
├── docs/               # Swagger configuration
├── routes/             # Central route registry
├── app.ts              # Express app setup (helmet, CORS, rate limiting)
└── server.ts           # Server entry point
```

## Password Requirements

Passwords must meet all of the following:
- Minimum 8 characters
- At least one uppercase letter (`A-Z`)
- At least one lowercase letter (`a-z`)
- At least one digit (`0-9`)
- At least one special character (non-alphanumeric)

## Security Features

- **JWT algorithm pinning** - Tokens signed and verified with HS256 only
- **Helmet** - HTTP security headers (HSTS max-age: 1 year)
- **CORS** - Configurable allowed origins via `CORS_ORIGINS`
- **Rate limiting** - Global (100 req/15min) + auth-specific (5 attempts/15min)
- **Body size limit** - 10KB max request body
- **Input validation** - All endpoints validated with Zod `.strict()` schemas
- **SQL injection prevention** - Whitelist-based ORDER BY, parameterized queries
- **Mass assignment prevention** - Explicit field whitelists in update operations
- **IDOR prevention** - Ownership verification on all resource access/modification
- **Generic error messages** - No internal details leaked in production
- **Auth event logging** - Login success/failure, registration, token errors logged
- **Soft delete** - Projects use `deletedAt` timestamp, not hard delete
- **Seed credentials from env** - No hardcoded passwords in seed scripts

## Environment Variables

See `.env.example` for the full list (27 variables). Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_NAME` | `project_task_db` | Database name |
| `JWT_SECRET` | *(required)* | Min 32 chars, used for HS256 signing |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `NODE_ENV` | `development` | `development`, `production`, or `test` |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `API_PREFIX` | `/api/v1` | Route prefix |
| `DOCS_PATH` | `/docs` | Swagger UI path |
| `HEALTH_PATH` | `/health` | Health check path |
| `DEFAULT_PAGE_LIMIT` | `10` | Default pagination limit |
| `MAX_PAGE_LIMIT` | `100` | Maximum pagination limit |

## Testing

Run unit tests (no database required):
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

Run integration tests (requires running PostgreSQL):
```bash
pnpm test:integration
```

## Architecture Decisions

- **Arrow function class properties** on controllers to preserve `this` binding with asyncWrapper
- **Constructor injection** for services with repository interfaces (Dependency Inversion Principle)
- **JwtUtil** extracted as standalone class (Single Responsibility Principle)
- **asyncWrapper** pattern for error handling (separation of concerns)
- **Global error handler** handles: AppError, ZodError, JWT errors, TypeORM errors, SyntaxError

## License

ISC
