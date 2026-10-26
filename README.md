# API template

A small, solid REST API starter by **Vertex Code by Ȥrk Team**: [Hono](https://hono.dev), Zod validation, API-key protection for writes, clean JSON errors and tests.

## Start

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:3000/health
```

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/health` | – |
| GET | `/items`, `/items/:id` | – |
| POST | `/items` | `x-api-key` |
| PATCH | `/items/:id` | `x-api-key` |
| DELETE | `/items/:id` | `x-api-key` |

The store in `src/store.ts` lives in memory: swap it for your database (PostgreSQL, SQLite, MongoDB…) without touching the routes.

## Français

Base d’API REST : Hono, validation Zod, clé d’API pour les écritures, erreurs JSON propres et tests. Remplacez le stockage en mémoire de `src/store.ts` par votre base de données.

---
Made by [Vertex Code by Ȥrk Team](https://www.zrk.lol) · MIT licence
