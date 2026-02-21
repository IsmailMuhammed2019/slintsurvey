# SLINT Survey (Next.js + shadcn + Prisma)

This app is a migration of the SLINT institutional survey into Next.js with:

- shadcn UI components
- PostgreSQL persistence
- Prisma ORM
- Local Docker Compose for the database

## 1) Start PostgreSQL (Docker)

```bash
docker compose up -d
```

## 2) Configure environment

```bash
cp .env.example .env
```

## 3) Create Prisma client + migrate schema

```bash
npm run db:generate
npm run db:migrate -- --name init
```

## 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- API routes:
  - `POST /api/responses` submit survey
  - `GET /api/responses` list responses
  - `DELETE /api/responses/:id` delete response
- Logo asset is served from `public/logo.png`.
