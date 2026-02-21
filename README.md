# SLINT Survey (Next.js + shadcn + Prisma)

This app is a migration of the SLINT institutional survey into Next.js with:

- shadcn UI components
- PostgreSQL persistence
- Prisma ORM
- Docker Compose for both app and database

## Run Everything In Containers

```bash
docker compose up -d --build
```

Open `http://localhost:3000`.

## Stop Containers

```bash
docker compose down
```

## Notes

- The app container runs Prisma migrations on startup (`prisma migrate deploy`) and then starts Next.js.
- PostgreSQL runs in `slint-postgres` with persistent volume `postgres_data`.
- API routes:
  - `POST /api/responses` submit survey
  - `GET /api/responses` list responses
  - `DELETE /api/responses/:id` delete response
