# Bounty — Job Tracker

A full-stack job application tracker built with Next.js 16, PostgreSQL, and Tailwind CSS. Track every stage of your job search from a Kanban board, list, or table view — with a calendar, contacts, and document vault included.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [Features & Pages](#features--pages)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Bug Fixes Applied](#bug-fixes-applied)
10. [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer         | Technology                                       |
|---------------|--------------------------------------------------|
| Framework     | [Next.js 16.1.6](https://nextjs.org) (App Router)|
| Language      | TypeScript 5                                     |
| Styling       | Tailwind CSS 4 + custom CSS variables            |
| Database      | PostgreSQL (via [`postgres`](https://github.com/porsager/postgres) npm package) |
| Auth          | JWT (via [`jose`](https://github.com/panva/jose)), stored in `httpOnly` cookies |
| Password hash | `bcryptjs`                                       |
| Deployment    | VPS via PM2 + GitHub Actions CI/CD               |

---

## Project Structure

```
bounty/
├── migrations/              # SQL migrations (run in order)
│   ├── 001_initial.sql      # Tables: users, companies, applications, events, contacts, documents
│   └── 002_missing_columns.sql  # Adds is_link/url to documents; company/role to contacts
├── scripts/
│   └── migrate.js           # Runs all .sql files in migrations/ against DATABASE_URL
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated layout — all protected pages live here
│   │   │   ├── applications/    # Job board (Kanban, Table, List views)
│   │   │   ├── calendar/        # Monthly calendar of deadlines & follow-ups
│   │   │   ├── contacts/        # Recruiter/manager contact book
│   │   │   ├── dashboard/       # Stats overview
│   │   │   ├── documents/       # CV, cover letter, and link vault
│   │   │   └── profile/         # User settings
│   │   ├── (auth)/          # Unauthenticated pages (login, register)
│   │   ├── api/             # Route handlers
│   │   ├── globals.css      # CSS variables, component styles
│   │   └── layout.tsx       # Root layout (ThemeProvider)
│   ├── components/
│   │   ├── ThemeProvider.tsx    # Dark/light toggle via localStorage + data-theme
│   │   ├── TopNav.tsx           # Fixed top navigation bar
│   │   └── StatusBadge.tsx      # Reusable coloured status pill
│   ├── hooks/
│   │   └── useUser.ts           # Client-side current user hook
│   ├── lib/
│   │   ├── auth/index.ts        # JWT helpers, cookie management
│   │   └── db/
│   │       ├── index.ts         # postgres client singleton
│   │       └── queries/         # Per-entity query functions
│   └── types/index.ts           # All shared TypeScript types
├── proxy.ts                 # Next.js 16 route proxy (replaces middleware.ts)
├── .env.example             # Environment variable template
├── ecosystem.config.js      # PM2 process config (gitignored)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### 1. Clone & install

```bash
git clone <repo>
cd bounty
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://bounty_user:yourpassword@localhost:5432/bounty
JWT_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Create database & run migrations

```bash
createdb bounty
npm run db:migrate
```

This runs every `.sql` file in `migrations/` in alphabetical order. Always run **all** migrations in order — do not skip any.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed user created by `001_initial.sql` is:

| Email              | Password      |
|--------------------|---------------|
| admin@bounty.local | changeme123   |

**Change this password immediately in production.**

---

## Database Schema

### `users`
Stores account credentials and profile info.

| Column            | Type       | Notes                         |
|-------------------|------------|-------------------------------|
| id                | UUID PK    |                               |
| email             | TEXT UNIQUE|                               |
| password_hash     | TEXT       | bcrypt, cost factor 12        |
| name              | TEXT       |                               |
| title, phone, … | TEXT       | Optional profile fields       |

### `applications`
The core entity. Each row is one job application.

| Column              | Type     | Notes                                          |
|---------------------|----------|------------------------------------------------|
| status              | TEXT     | One of: `wishlist`, `applied`, `phone_screen`, `interview`, `offer`, `rejected`, `withdrawn`, `ghosted` |
| priority            | TEXT     | `low` / `medium` / `high`                     |
| work_type           | TEXT     | `onsite` / `remote` / `hybrid`                |
| salary_min/max      | INTEGER  | In the currency stored in `salary_currency`    |
| excitement_level    | INTEGER  | 1–5 scale                                     |

### `application_events`
Timeline entries (notes, calls, interviews) linked to an application.

### `contacts`
Recruiter / hiring manager contacts. After migration 002 includes `company TEXT` and `role TEXT` columns.

### `documents`
File uploads and external links. After migration 002 includes `is_link BOOLEAN` and `url TEXT` columns.

---

## Authentication

Auth uses **JWT stored in an `httpOnly` cookie** named `bounty_token`.

Flow:
1. `POST /api/auth/register` or `POST /api/auth/login` → creates a signed JWT (7-day expiry) → sets `bounty_token` cookie
2. `proxy.ts` reads that cookie on every non-API request and redirects unauthenticated users to `/login`
3. Server components call `getAuthUser()` which reads the cookie and verifies the JWT
4. API route handlers call `requireAuth()` which throws `"Unauthorized"` if the token is missing or invalid

### Security notes

- JWTs are signed with HS256 using `JWT_SECRET`. Rotate this secret in production by restarting the app — all existing sessions will be invalidated.
- The `proxy.ts` file (Next.js 16's replacement for `middleware.ts`) performs an **optimistic** check: it only verifies that the cookie *exists*, not that the JWT is valid. This is intentional — full JWT verification is done in each route handler via `requireAuth()`. This matches Next.js 16's recommended pattern of keeping the proxy thin.
- Passwords are hashed with bcrypt at cost factor 12.

---

## Features & Pages

### Dashboard `/dashboard`

Shows four stat cards:
- **Total applications** — all rows in your applications table
- **Active pipeline** — applications not in `rejected`, `withdrawn`, or `ghosted`
- **Response rate** — `(interviews + offers) / applied × 100`
- **Offer rate** — `offers / applied × 100`

### Job Board `/applications`

Three view modes switchable from the toolbar:

| View    | Description                                               |
|---------|-----------------------------------------------------------|
| Kanban  | Drag-and-drop cards across pipeline columns               |
| Table   | Sortable spreadsheet with inline status dropdown          |
| List    | Card rows with selection checkboxes for bulk operations   |

**Bulk operations** (Table & List views): select rows → delete or archive (set to `withdrawn`).

**Export**: downloads a CSV of the current filtered set (or all if nothing selected).

**Filters**: work type, priority, and keyword search.

### Application Detail `/applications/[id]`

Shows all fields for a single application plus an **Activity Log** where you can record notes, calls, emails, and interviews with timestamps.

### Calendar `/calendar`

Monthly calendar showing:
- **Blue** — application dates
- **Amber** — follow-up dates
- **Red** — deadlines

Upcoming items sidebar shows the next 6 entries with days-remaining countdown.

### Contacts `/contacts`

Add recruiters and hiring managers with name, email, phone, company, role, and LinkedIn URL.

### Documents `/documents`

Two upload modes:
- **File upload** — accepts PDF, DOCX, PNG, JPG up to 10MB. Files are saved to `uploads/<userId>/` on disk.
- **Link** — saves an external URL (portfolio, GitHub, etc.)

Grouped by document type: Resume, Cover Letter, Portfolio, ID Document, Reference, Other.

### Profile `/profile`

Update display name and email address.

---

## API Reference

All API routes are under `/api/`. Every route except `/api/auth/*` requires a valid `bounty_token` cookie.

### Auth

| Method | Path                  | Body                          | Response          |
|--------|-----------------------|-------------------------------|-------------------|
| POST   | /api/auth/register    | `{ email, name, password }`   | `{ user }`        |
| POST   | /api/auth/login       | `{ email, password }`         | `{ user }`        |
| POST   | /api/auth/logout      | —                             | `{ success }`     |

### Applications

| Method | Path                             | Description                          |
|--------|----------------------------------|--------------------------------------|
| GET    | /api/applications                | List all for current user            |
| POST   | /api/applications                | Create new application               |
| GET    | /api/applications/[id]           | Get single application + events      |
| PATCH  | /api/applications/[id]           | Update fields (any subset)           |
| DELETE | /api/applications/[id]           | Delete application                   |
| DELETE | /api/applications/bulk           | Delete many `{ ids: string[] }`      |
| PATCH  | /api/applications/bulk           | Update status `{ ids, status }`      |
| POST   | /api/applications/export         | Export CSV or HTML `?format=csv`     |
| POST   | /api/applications/[id]/events    | Add activity log entry               |

### Contacts

| Method | Path                  | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/contacts         | List all contacts       |
| POST   | /api/contacts         | Create contact          |
| DELETE | /api/contacts/[id]    | Delete contact          |

### Documents

| Method | Path                        | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | /api/documents              | List all documents                   |
| POST   | /api/documents              | Upload file (FormData) or add link (JSON) |
| DELETE | /api/documents/[id]         | Delete document (and file from disk) |
| GET    | /api/documents/[id]/file    | Download uploaded file               |

### Other

| Method | Path            | Description                |
|--------|-----------------|----------------------------|
| GET    | /api/profile    | Get current user profile   |
| PATCH  | /api/profile    | Update name / email        |
| GET    | /api/dashboard  | Get stats object           |

---

## Deployment

The project ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys to a VPS on every push to `main`.

### Server setup (one-time)

```bash
# Install Node.js 20, PostgreSQL, PM2, nginx
sudo apt install nodejs postgresql nginx
npm install -g pm2

# Create database user
sudo -u postgres psql -c "CREATE USER bounty_user WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "CREATE DATABASE bounty OWNER bounty_user;"

# Clone & setup
cd /var/www
git clone <repo> bounty
cd bounty
cp .env.example .env.local   # fill in values
npm install
npm run db:migrate
npm run build

# Create ecosystem.config.js (NOT committed to git):
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'bounty',
    script: 'node_modules/.bin/next',
    args: 'start',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    }
  }]
}
EOF

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### GitHub Actions secrets required

| Secret         | Value                                  |
|----------------|----------------------------------------|
| `VPS_HOST`     | Server IP or hostname                  |
| `VPS_USER`     | SSH username (e.g. `ubuntu`)           |
| `VPS_SSH_KEY`  | Private SSH key (the `-----BEGIN...` block) |

### nginx reverse proxy

```nginx
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Serve uploaded files directly (optional optimisation)
  location /uploads/ {
    alias /var/www/bounty/uploads/;
    expires 7d;
  }
}
```

Use Certbot for HTTPS: `sudo certbot --nginx -d yourdomain.com`

---

## Bug Fixes Applied

The following bugs were found and fixed during this audit:

### 1. 🔴 Auth cookie name mismatch (critical)

**File**: `middleware.ts` / `proxy.ts`  
**Problem**: The proxy checked for a cookie named `bounty_session`, but `src/lib/auth/index.ts` always sets a cookie named `bounty_token`. This meant every page load on a protected route would redirect to `/login`, making it impossible to stay logged in.  
**Fix**: Updated `proxy.ts` to check `bounty_token`.

### 2. 🔴 Next.js 16 breaking change — `middleware.ts` → `proxy.ts`

**File**: `middleware.ts`  
**Problem**: Next.js 16 deprecated `middleware.ts` in favour of `proxy.ts`. The exported function must also be renamed from `middleware` to `proxy`. Using the old file name causes a deprecation warning and may break on future patch releases.  
**Fix**: Renamed to `proxy.ts`, export renamed to `proxy`.

### 3. 🔴 Documents table missing `is_link` and `url` columns

**File**: `migrations/001_initial.sql`, `src/app/api/documents/route.ts`  
**Problem**: The API and frontend relied on `is_link BOOLEAN` and `url TEXT` columns in the `documents` table, but the initial migration never created them. Every document operation (`INSERT`, `SELECT`) would throw a PostgreSQL column-not-found error.  
**Fix**: Added `migrations/002_missing_columns.sql` which adds both columns with `ALTER TABLE … ADD COLUMN IF NOT EXISTS`.

### 4. 🔴 Contacts table missing `company` and `role` columns

**File**: `migrations/001_initial.sql`, `src/lib/db/queries/contacts.ts`  
**Problem**: The `contacts` table only has `company_id` (a UUID FK) and `title`. The queries and TypeScript type used plain-text `company` and `role` columns that didn't exist, causing every contact INSERT and SELECT to fail.  
**Fix**: Migration 002 adds `company TEXT` and `role TEXT` to the contacts table. Backfills `role` from `title` for any existing rows.

### 5. 🟡 Kanban salary range displayed max salary twice

**File**: `src/app/(app)/applications/KanbanView.tsx`  
**Problem**: The salary range display was `US$salary_max – US$salary_max` because it incorrectly referenced `salary_max` in both halves of the range string.  
**Fix**: Corrected to show `US$salary_min – US$salary_max`.

### 6. 🟡 Kanban board state doesn't refresh after drag-and-drop

**File**: `src/app/(app)/applications/KanbanView.tsx`  
**Problem**: `const [items, setItems] = useState<Application[]>(apps)` — React only uses the initial value of `apps` to seed the state. When `router.refresh()` causes the server to re-fetch and pass new `apps` props, the component never re-renders with the updated list.  
**Fix**: Added `useEffect(() => { setItems(apps) }, [apps])` to sync the local state whenever the prop changes.

### 7. 🟢 CSS: modal overlay blocked pointer events; kanban card shadows clipped

**File**: `src/app/globals.css`  
**Problem 1**: The `.modal-overlay` rule did not guarantee pointer events reached the `.modal-panel` in all browsers.  
**Problem 2**: `.kanban-col` had `overflow: hidden` which clipped card box-shadows. The fix uses `overflow: visible` on the column body and ensures shadows have room to render.  
**Fix**: Added `pointer-events: auto` and `z-index: 1` to `.modal-panel`. Changed kanban column body to allow overflow while keeping scroll.

### 8. 🟢 CSS: no visible keyboard focus rings on inputs

**File**: `src/app/globals.css`  
**Problem**: `focus:outline-none` was applied globally through Tailwind utility classes on every input and textarea, removing all keyboard focus indicators. This is an accessibility issue.  
**Fix**: Added `:focus-visible` rules for inputs, textareas, selects, buttons, and links to restore amber-coloured focus rings.

---

## Known Limitations

- **File uploads are stored on local disk** (`uploads/` directory). This works for a single-server VPS but will not work across multiple servers or serverless deployments. For production at scale, replace with S3 or similar object storage.
- **No rate limiting** on auth endpoints. Consider adding `express-rate-limit` or an nginx rate limit config for production.
- **No email verification** on registration — any email address can be used.
- **Top nav search** field is currently a visual placeholder — it does not search across all entities.
- **Contacts** are not linked to applications through the UI, even though the database has `application_id` and `company_id` foreign key columns available.
