# PeduliASD Backend (MySQL Edition)

REST API backend for **PeduliASD**, a management system for children with Autism Spectrum Disorder (ASD) — member registration, appointment scheduling, articles, and a community Q&A forum. This version migrates the original MongoDB implementation to **MySQL** using the **Knex.js** query builder.

## Features
- Member management with role-coded identifiers (`A-` prefix for ASD members, `N-` prefix for non-ASD members)
- Appointment booking with business-rule validation (no double booking, no past-dated appointments, one active appointment per member)
- Community Q&A forum with role-based access (public can ask, admin can answer / edit / delete)
- JWT-based authentication with bcrypt password hashing
- File uploads via Multer for articles/attachments
- Serves the bundled frontend build in production

## Tech Stack
Node.js · Express · MySQL · Knex.js · JSON Web Token · Docker Compose · ESLint/Prettier

## Getting Started
```bash
pnpm install
docker compose up -d          # starts MySQL (see docker-compose.yml)
npx knex migrate:latest        # run migrations

# create a .env with: DATABASE_URL, DATABASE_PORT, DATABASE_USER,
# DATABASE_PASSWORD, DATABASE_DATABASE (see knexfile.js)

pnpm run server                 # nodemon dev server
```

## Project Structure
```
backend/      # routes, controllers, utils
migrations/   # Knex migrations
peduliasd/    # frontend production build served by Express
```
