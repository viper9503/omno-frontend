# Omno Frontend

## Platform targets
- **iOS and Android only.** Web is deprioritized — do not add web-specific code or test web builds.

## Stack
- Expo 54, React Native, Expo Router (NativeTabs for tab navigation)
- NativeWind (TailwindCSS) for styling
- React Native Reusables (shadcn-style UI primitives in `components/ui/`)
- Zustand for state management
- PocketBase for backend (auth + data)

## Architecture

### Directory structure
```
app/              Route handlers — data fetching, layout, navigation
features/         Feature modules — pure presentational components, hooks
  <name>/
    components/   Presentational components with barrel index.ts
    hooks/        Feature-specific hooks (e.g. useElapsedTime)
components/ui/    Shared UI primitives (button, card, input, text, etc.)
lib/
  api/            API client, auth, hooks, generated types
  stores/         Shared Zustand stores (timer, projects, entries)
  format.ts       Time/date formatting utilities
  theme.ts        Light/dark theme definitions
  utils.ts        cn() helper (clsx + tailwind-merge)
```

### Data flow
- **API calls belong in route files (`app/`), not in feature components.** Route files fetch data via hooks from `lib/api/` and pass it down as props. Feature components are pure presentation — they receive data through props and do not call API hooks directly.

### API layer (`lib/api/`)
- `types.ts` — **auto-generated**, do not edit by hand (see Commands below)
- `config.ts` — `DEV_BYPASS_AUTH` flag and `POCKETBASE_URL`
- `auth-store.ts` — Zustand store for auth state (init, signIn, signOut)
- `client.ts` — `ClockApi` interface + PocketBase/mock implementations
- `mock-client.ts` — in-memory mock used when `DEV_BYPASS_AUTH = true`
- `provider.tsx` — React Context providing `ApiClient` to the tree
- `query-client.ts` — shared TanStack Query `QueryClient` instance
- `hooks.ts` — TanStack Query hooks (useQuery/useMutation wrappers)
- `use-current-user.ts` — current authenticated user info from auth store
- `use-refresh.ts` — `useRefresh()` hook for pull-to-refresh (invalidates all queries)
- `index.ts` — public barrel exports

When adding new API functionality:
1. Define the method on `ClockApi` in `client.ts`, implement in both `createPocketBaseClient()` and `createMockClient()`
2. Add a query key to `queryKeys` in `hooks.ts`
3. Expose a `useQuery` or `useMutation` hook in `hooks.ts`

### Data fetching (TanStack Query)
- **All data-fetching hooks must use TanStack Query** (`useQuery` for reads, `useMutation` for writes). Do not use manual `useState`/`useEffect` fetch patterns.
- Query keys are centralized in `queryKeys` in `hooks.ts`. Always use them — never inline key arrays.
- Mutations should `invalidateQueries` on success to keep the cache fresh.
- Pull-to-refresh: route files call `useRefresh()` and pass it to `PageView`'s `onRefresh`. This invalidates all queries on the screen — no need to enumerate individual hooks.
- The `QueryClientProvider` wraps the app in `_layout.tsx`.

### Shared stores (`lib/stores/`)
- `timer-store.ts` — clock status derived from latest API event (used by timer, dashboard, API sync)
- `projects-store.ts` — project list CRUD (used by timer, entries, projects, reports)
- `entries-store.ts` — time entry list with filtering/aggregation (used by entries, projects, reports, dashboard)
- Auth store lives separately in `lib/api/auth-store.ts` since it's tightly coupled with the PocketBase client

### Auth
- `DEV_BYPASS_AUTH = true` — skips authentication, uses mock backend (for development without a running server)
- `DEV_BYPASS_AUTH = false` — requires real PocketBase sign-in with email/password
- Auth state lives in `auth-store.ts`; the PocketBase instance is shared with the API client
- `app/index.tsx` acts as the auth gate, redirecting to `/login` or `/(tabs)`

## Page layout
- **All screens must use a shared `PageView` wrapper** (`components/ui/page-view.tsx`) for consistent padding, background, and scroll behavior across the entire app.
- Every tab screen should look visually consistent — same spacing, same base structure.

## Commands
- `npm run dev` — start Expo dev server (LAN mode, cache cleared)
- `npm run android` — start on Android
- `npm run ios` — start on iOS
- `npx tsc --noEmit` — type check
- `npx pocketbase-typegen --db ../omno-backend/pb_data/data.db --out lib/api/types.ts` — regenerate PocketBase types from the local database

## Settings & drawer modals
- Settings sub-screens live under `app/(settings)/` (route group, no nested navigator) and use the shared `SettingsPage` wrapper from `features/settings/components/`
- **Use `@gorhom/bottom-sheet` `BottomSheetModal` for any settings action that requires keyboard input, gestures, or advanced configuration** (e.g. editing a team name, creating a team). Do not use `Dialog` for these — drawers provide a native iOS feel with backdrop, dynamic sizing, and proper keyboard handling.
- Simple toggles, navigation, and destructive confirmations (via `Alert.alert`) can stay inline in settings rows.
- Drawer pattern: `BottomSheetModal` with `enableDynamicSizing`, `enablePanDownToClose={false}`, no handle, Cancel/Save header bar, `BottomSheetTextInput` for text fields. Always call `Keyboard.dismiss()` before `dismiss()` when closing.
- The `BottomSheetModalProvider` wraps the app in `_layout.tsx` — modals render above everything including tab bars.

## Conventions
- Feature components export via barrel `index.ts` files
- UI primitives use CVA (class-variance-authority) for variants
- Zustand stores use the selector pattern: `useStore((s) => s.field)`
- `@/*` path alias maps to the project root
- Haptic feedback on primary user actions (clock in/out)
- Monospace font (JetBrainsMono) for timer displays
