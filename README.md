# QIS — Quantitative Investment Society

Production website for the Quantitative Investment Society at Knox College, and the home of **The Heist**, a live multiplayer public-goods game the club runs at in-person meetings.

**Live site:** https://knox-qis.vercel.app

## What is in here

Two products share one Next.js app:

1. **Content site** — 18 routes covering about, events, research write-ups, competitions, team, contact and the sign-up flow. All copy lives in typed TypeScript modules under `data/`, so adding an event or a research post is one object literal and no CMS.
2. **The Heist** — a database-backed game for a room full of players, with four surfaces: a phone client, an organiser control panel, a projector view for the big screen, and a browsable archive of past sessions.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16, App Router |
| UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, class-variance-authority, tailwind-merge |
| Motion | Framer Motion, react-intersection-observer |
| Icons | lucide-react |
| Database | Neon serverless Postgres |
| ORM | Prisma 7 with @prisma/adapter-neon |
| Package manager | pnpm 10 |
| Hosting | Vercel |

## The Heist

Three rounds of a public-goods game with an audit mechanic. Each round a player receives a private endowment and chooses how much to put into the shared team pot; the pot is multiplied and split evenly, so free-riding pays until somebody spends money to audit you.

Default rules live in `lib/heist/constants.ts` and can be overridden per session through the JSON `config` column:

| Parameter | Default |
| --- | --- |
| Endowment per round | 10,000 |
| Pot multiplier | 1.5x |
| Allowed contributions | 0 / 2,000 / 4,000 / 6,000 / 8,000 / 10,000 |
| Audit cost | 1,000 |
| Audit damage | 3,000 |
| Audit success threshold | 6,000 |
| Audit success bonus | 500 |
| Team audit bonus pool | 10,000 |

### Phase machine

The organiser walks the session through a fixed sequence, opening and closing each phase:

```
lobby -> r1-contribution -> r2-contribution -> r2-audit -> r3-contribution -> r3-audit -> results
```

Round 1 has no audit phase on purpose: players have to commit before they have seen anyone else behave.

### Surfaces

| Route | Audience |
| --- | --- |
| `/games/heist` | Rules and entry point |
| `/games/heist/play` | Player client, phone-sized |
| `/games/heist/admin` | Organiser control panel, key-gated |
| `/games/heist/projector` | Leaderboard for the room, own layout |
| `/games/heist/history` | Archive of finished sessions |

### Live updates

Clients are pull-based. `useHeistPoll` in `lib/heist/use-heist-poll.ts` refetches `/api/heist/state` on a 2-second interval, keeps the last good payload, and surfaces a connection error without tearing down the UI. Polling was chosen over WebSockets because state transitions are coarse and organiser-driven, and because a serverless deployment target makes a short poll cheaper to operate than long-lived sockets.

### Scoring

`lib/heist/scoring.ts` is a pure module: it takes a whole `GameSession` and derives per-round wealth, per-player totals, team standings, the leaderboard, submission counts and post-game highlights. It never touches the database, which is what makes it exhaustively testable.

## API

Next.js Route Handlers under `app/api/heist/`:

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/heist/join` | Claim a seat, returns a player token |
| GET | `/api/heist/me` | Resolve the caller from their token |
| GET | `/api/heist/state` | Full session state for polling clients |
| POST | `/api/heist/submit` | Record a contribution or an audit |
| POST | `/api/heist/admin` | Session lifecycle and phase control |
| GET | `/api/heist/history` | List finished sessions |
| GET | `/api/heist/history/[id]` | Replay one finished session |
| GET | `/api/heist/debug` | Connectivity and state introspection |

Auth is header-based and sized for the threat model of a club meeting:

- Players send `x-player-token`, a UUID minted at join time and unique per player row.
- Admin calls send `x-admin-key`, compared against `HEIST_ADMIN_KEY`. There is no default value, so an unset variable makes the panel unusable rather than open.

## Data model

Four Prisma models in `prisma/schema.prisma`:

```
Session 1--n Team 1--n Player 1--n Submission
```

- `Session` stores the current phase, an open/closed flag for that phase, and a JSON `config` blob, so a session can override the default rules without a migration.
- `Team` and `Player` are addressed by short human-typable codes, uniquely scoped to a session, so people can join by reading a code off a slide. Teams default to four seats.
- `Submission` is one row per contribution or audit. Scores are always derived from those rows rather than stored, so fixing the scoring engine retroactively corrects every archived session.
- Relations cascade on delete, and `Submission` carries composite indexes on `[sessionId, phase]` and `[sessionId, playerCode]`, the two access patterns the scoring engine actually uses.

## Tests

The scoring engine has a scenario suite of **16 test cases and 87 assertions**, simulating multi-team, multi-round games with different strategies: full cooperation, free-riding and audit punishment among them.

```bash
npx tsx lib/heist/__tests__/scoring.test.ts
```

It runs as a plain script against a small hand-rolled assert harness instead of pulling in a test runner, so a fresh clone can verify the game rules with no extra tooling.

## Local development

```bash
pnpm install            # postinstall runs prisma generate
cp .env.example .env    # fill in the two variables below
pnpm prisma db push     # create the schema in your Neon database
pnpm dev                # http://localhost:3000
```

pnpm 10 is pinned through the `packageManager` field in `package.json`.

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Neon Postgres connection string with sslmode=require |
| `HEIST_ADMIN_KEY` | yes | Secret for the Heist admin panel, no default |

The content site renders without a database; only The Heist needs `DATABASE_URL`.

### Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Next dev server |
| `pnpm build` | `prisma generate` then `next build` |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint through eslint-config-next |

## Project structure

```
app/
  api/heist/      8 route handlers: join, me, state, submit, admin, history, history/[id], debug
  games/heist/    play, admin, projector, history - the four Heist surfaces
  games/          client-only games: beauty contest, mental math, probability drills
  about/ events/ research/ competition/ team/ join/ contact/
components/
  sections/       hero, pillars, stats bar, featured events, timeline, team grid, join CTA
  ui/             button, card, badge, navbar, footer, faq accordion, animated counter
data/             typed content: events, research, competitions, games, team, faq, site
lib/
  heist/          constants, types, scoring, game-state, use-heist-poll, __tests__
  prisma.ts       singleton Prisma client
prisma/schema.prisma
```

## Deployment

Deployed on Vercel from `master`. `pnpm build` regenerates the Prisma client before `next build`, so a schema change ships in the same commit as the code that depends on it.

---

Built and maintained by [Tan (Vincent) Le](https://github.com/VincentTLe).
