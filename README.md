# Omno

**A modular, cross-platform time tracking app built with Expo & PocketBase.**

Omno is a mobile-first time tracking and project management tool designed for teams and freelancers. Clock in and out, assign time to projects, review entries on a calendar, generate reports, and manage teams — all from a clean, native-feeling interface on iOS and Android.

---

## Why Omno?

Most time trackers are either too simple (just a stopwatch) or too bloated (enterprise HR suites). Omno sits in the sweet spot: it has the features that actually matter — a live timer with GPS context, project-level breakdowns, daily/weekly reports, team invites — without the cruft. The architecture is built to be extended, not rewritten.

---

## Features

- **Live Timer** — Clock in/out with haptic feedback, assign time to projects, and view a real-time elapsed display (monospace, down to the second). Includes a map background showing your current location for geofenced work zones.
- **Project Management** — Create, edit, and color-code projects. All time entries are linked to projects for clean breakdowns.
- **Calendar View** — Browse entries by day on a month calendar. Tap any day to see a detailed log of what you worked on.
- **Reports & Analytics** — Daily summaries and per-project breakdowns with hours and percentages. See where your time actually goes.
- **Team Collaboration** — Create teams, invite members, and manage team-level settings. Built for small crews, not enterprise org charts.
- **Notifications & Reminders** — Configurable push notifications so you don't forget to clock in or out.
- **Work Zones** — Define geographic zones and tie them to your time entries via `expo-location` and `react-native-maps`.
- **Light & Dark Mode** — Full theme support baked into the design system, toggled from settings.

---

## Architecture & Modularity

Omno follows a strict separation between **routing/data** and **presentation**:

```
app/                Route handlers — data fetching, layout, navigation
features/           Feature modules — pure presentational components & hooks
  ├── timer/          Clock in/out, elapsed time, project picker, timeline
  ├── dashboard/      Activity feed, hours progress, status cards
  ├── calendar/       Month calendar, day entries
  ├── entries/        Time entry list with filtering/aggregation
  ├── projects/       Project CRUD, project cards
  ├── reports/        Daily summary, project breakdown
  └── settings/       Settings groups, team management
components/ui/      Shared UI primitives (Button, Card, Input, Text, etc.)
lib/
  ├── api/            PocketBase client, auth, TanStack Query hooks, generated types
  ├── stores/         Zustand stores (timer, projects, entries)
  ├── format.ts       Time/date formatting utilities
  ├── theme.ts        Light/dark theme definitions
  └── utils.ts        cn() helper (clsx + tailwind-merge)
```

**Key architectural decisions:**

- **Route files own the data.** `app/` screens fetch via TanStack Query hooks and pass everything down as props. Feature components are pure — they render what they receive and never call API hooks directly.
- **Feature modules are self-contained.** Each feature folder has its own `components/` and `hooks/` directories with barrel `index.ts` exports. You can add, remove, or swap features without touching unrelated code.
- **Shared UI primitives use CVA.** The `components/ui/` layer uses [class-variance-authority](https://cva.style) for variant-driven styling, following the same pattern as shadcn/ui (via [React Native Reusables](https://github.com/mrzachnugent/react-native-reusables)).
- **State is centralized in Zustand stores** with the selector pattern (`useStore((s) => s.field)`), keeping re-renders tight and predictable.

---

## Customizability

Omno is designed to be forked, themed, and extended:

- **Styling** — NativeWind (TailwindCSS for React Native) powers the entire UI. Change `tailwind.config.js` and `global.css` to rebrand the app in minutes. Every color, spacing value, and font is token-driven.
- **UI Components** — The `components/ui/` layer is a standalone primitive library. Swap in your own `Button`, `Card`, or `Input` without touching business logic.
- **API Layer** — The `ClockApi` interface in `lib/api/client.ts` defines a clean contract. PocketBase is the default implementation, but you can write a new client targeting any backend (Supabase, Firebase, a custom REST API) by implementing the same interface.
- **Mock Client** — Set `DEV_BYPASS_AUTH = true` and the entire app runs against an in-memory mock backend. No server needed for local development or demos.
- **Type Generation** — PocketBase types are auto-generated from the database schema using `pocketbase-typegen`. One command keeps your frontend types perfectly in sync with your backend.

---

## Backend — PocketBase

Omno uses [PocketBase](https://pocketbase.io) as its backend, which gives you:

- **SQLite under the hood** — a single portable database file. No Postgres cluster, no managed database bill. Back it up by copying one file.
- **Built-in auth** — Email/password authentication out of the box, with JWT tokens. The app's `auth-store.ts` handles sign-in, sign-out, and session persistence via AsyncStorage.
- **Real-time subscriptions** — PocketBase supports live data over SSE, ready to wire up for real-time team dashboards.
- **Admin UI** — A full admin dashboard ships with PocketBase at `/_/`. Manage users, collections, and data without writing admin tooling.
- **Docker-ready** — Run the backend in a single container. A typical deployment is just `docker run pocketbase/pocketbase` with a mounted volume for data persistence.

```bash
# Example: run PocketBase in Docker
docker run -d \
  --name omno-backend \
  -p 8090:8090 \
  -v ./pb_data:/pb/pb_data \
  ghcr.io/pocketbase/pocketbase:latest
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo 54, React Native 0.81 |
| Navigation | Expo Router 6 (file-based routing, NativeTabs) |
| Styling | NativeWind 4 (TailwindCSS), class-variance-authority |
| State | Zustand 5 |
| Data Fetching | TanStack Query 5 |
| Backend | PocketBase (SQLite, JWT auth, REST API) |
| UI Primitives | React Native Reusables (@rn-primitives) |
| Maps | react-native-maps |
| Animations | react-native-reanimated, Gesture Handler |
| Bottom Sheets | @gorhom/bottom-sheet |
| Icons | lucide-react-native |
| Fonts | JetBrains Mono (timer display) |
| Language | TypeScript 5.9 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- A running PocketBase instance (or use `DEV_BYPASS_AUTH = true` for mock mode)

### Install & Run

```bash
git clone https://github.com/viper9503/omno-frontend.git
cd omno-frontend
npm install

# Start in dev mode (LAN, cache cleared)
npm run dev

# Or target a specific platform
npm run ios
npm run android
```

### Connect to PocketBase

1. Update `POCKETBASE_URL` in `lib/api/config.ts` to point to your PocketBase instance.
2. Set `DEV_BYPASS_AUTH = false` for real authentication.
3. Run `npx pocketbase-typegen --db ../omno-backend/pb_data/data.db --out lib/api/types.ts` to regenerate types from your schema.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo dev server (LAN mode, cache cleared) |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npx tsc --noEmit` | Type check the project |
| `npx pocketbase-typegen ...` | Regenerate PocketBase types from the database |

---

## License

MIT
