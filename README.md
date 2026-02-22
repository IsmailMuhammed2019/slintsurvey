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
- Public route: `/` (survey only)
- Protected admin routes: `/dashboard` and `/responses`
- Login route: `/login`
- Default admin credentials (change in `.env`):
  - Username: `admin`
  - Password: `slint123`
- API routes:
  - `POST /api/responses` submit survey
  - `GET /api/responses` list responses (auth required)
  - `DELETE /api/responses/:id` delete response (auth required)
