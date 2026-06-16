# Stiu ca Stii Quiz

Joc web quiz pentru proiectul "Stiu ca Stii", construit ca MVP single-player cu runde normale, runda finala, inimi temporare, leaderboard persistent si panou admin.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose

## Rulare locala

```bash
npm install
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Aplicatia porneste la:

```bash
http://localhost:3000
```

## Env local

Copiaza `.env.example` in `.env` si completeaza valorile:

```bash
cp .env.example .env
```

## Rute principale

- `/`
- `/play/nickname`
- `/play/heart`
- `/play/session/[sessionId]`
- `/leaderboard`
- `/settings`
- `/adminmagistru`

## Admin

Adminul foloseste parola din `ADMIN_PASSWORD`.

## Deploy VPS

Instructiunile complete sunt in [DEPLOY.md](DEPLOY.md).

Productia foloseste:

- `docker-compose.prod.yml`
- `.env.production.example`, copiat ca `.env` pe server
- Nginx reverse proxy separat pentru `stiucastii.owh.md`
- port intern `3010`

Aplicatia trebuie tinuta separata de Cinemateca:

```bash
/var/www/cinemateca
/var/www/stiucastii
```
