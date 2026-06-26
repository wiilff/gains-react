# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite is configured.

## Environment

Requires a `.env` file with:
```
VITE_API_URL=<backend base URL>
```

The live backend is at `http://68.183.65.231/`.

## Architecture

**Gains** is a gym progress tracking React SPA. Stack: React 19, React Router v7, Tailwind CSS v4, Recharts, Axios.

### Auth flow

`src/api/axios.js` creates a singleton Axios instance that:
- Attaches a JWT `accessToken` (stored in memory + localStorage) to every request
- On 401/403, automatically calls `/api/auth/refresh` to get a new token (using an HttpOnly cookie) and retries the original request
- On refresh failure, redirects to `/login`

`src/context/AuthContext.jsx` provides `{ user, login, register, logout }` to the whole tree and attempts a silent refresh on mount. `PrivateRoute` / `PublicRoute` gate pages based on auth state.

### API layer (`src/api/`)

Each file wraps REST calls for one domain using the shared Axios instance:
- `workouts.js` — CRUD for workouts
- `sets.js` — add/update/delete exercise sets within a workout
- `exercises.js` — exercises and muscle groups
- `splits.js` — weekly training splits
- `profile.js`, `user.js`, `friends.js` — user profile data

### Pages (`src/pages/`)

| Route | Page | Purpose |
|---|---|---|
| `/` | `Workouts` | List + create/edit/delete workouts |
| `/workout/:id` | `WorkoutDetails` | Add exercises, log sets, save per exercise |
| `/exercise` | `Exercises` | Browse all exercises |
| `/exercise/:id` | `ExerciseDetails` | Progress charts + per-session set history |
| `/profile` | `Profile` | Stats charts, splits link, account management |
| `/splits` | `SplitPage` | Create/edit weekly training splits |
| `/login` | `Login` | Login + register |

### Key component patterns

- **`CreateWorkoutModal`** is a generic slide-up modal shell reused everywhere (workout creation, exercise creation, split creation, profile editing).
- **`CoreButton`** is the standard primary button.
- **`ChartCard`** wraps any chart with a Weekly / Monthly / All Time filter toggle.
- **`LineChartComponent`** and **`TinyBarChart`** are thin Recharts wrappers accepting `data`, `xKey`, and `yKey`/`lines` props.

### Graph data (`src/utils/graphCalculations.js`)

Pure functions that transform raw API responses into Recharts-ready arrays:
- `volumeData(exerciseDetails)` — total volume per session for the line chart
- `topSetData(exerciseDetails)` — heaviest set per session
- `getTimeSpent(workouts, filter)` — minutes per day (currently commented out in Profile)
- `getMuscleGroupsTrained(workouts, filter)` — set counts by muscle group with weekly/monthly/all-time filtering

### Sets data model

A workout has `workoutExercises`, each with a `sets` array. Sets can be **persisted** (have a real `id`) or **temporary** (have a `tempId` from `uuid`). Both are tracked by `set.id || set.tempId` throughout `WorkoutDetails`. Saving calls `updateExerciseSets` which upserts all sets for a given `workoutExerciseId`.
