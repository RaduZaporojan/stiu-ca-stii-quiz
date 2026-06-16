# Știu că Știi Quiz

MVP UI pentru jocul web „Știu că Știi”, construit după mockup-urile existente din `design/Stiu ca Stii game`.

## Stack pregătit

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion pregătit pentru tranziții
- Prisma/PostgreSQL pregătite ca dependencies pentru pasul backend

## Rulare locală

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Aplicația pornește la:

```bash
http://localhost:3000
```

## Bază de date locală

Pentru development local, aplicația folosește PostgreSQL:

```env
DATABASE_URL="postgresql://stiucastii_user:stiucastii_password@localhost:5432/stiucastii?schema=public"
```

Pe Windows, dacă Docker Desktop nu poate porni până la activarea WSL2, se poate folosi PostgreSQL instalat nativ. După ce WSL2/Docker sunt active, baza poate fi pornită și cu:

```bash
docker compose up -d
```

## Ecrane UI incluse

- `/` welcome
- `/play/nickname`
- `/play/heart`
- `/play/categories`
- `/play/session/demo`
- `/play/final`
- `/result/demo`
- `/result/lost`
- `/leaderboard`
- `/admin`

## Asset-uri

Asset-urile folosite de UI sunt copiate în `public/assets`, inclusiv logo, inimi, timer, moving balls și fontul Barlow.
