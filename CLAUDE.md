# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Related Projects

This API is used by two frontend projects located in the same parent folder (`../`):

| Folder | Stack | Description |
|--------|-------|-------------|
| `../BO-FullStack` | Next.js | Backoffice admin panel — manages users, permissions, products, schedule |
| `../Barber-Tiago` | Vite + React | Public website for a specific client (booking + ecommerce) |

Both use **Kubb** to generate TypeScript types and React Query hooks from the Swagger JSON endpoints. When Swagger specs change, run `pnpm kubb` in each frontend project to regenerate.

---

## Commands

```bash
# Development (runs migrations then starts nodemon)
pnpm run dev

# Production (runs migrations then starts compiled server)
pnpm run start

# Build TypeScript
pnpm run build

# Docker (dev environment with MySQL + PHPMyAdmin)
pnpm run docker        # start
pnpm run docker-build  # build and start

# Database migrations (via Sequelize CLI)
pnpm exec sequelize-cli db:migrate
pnpm exec sequelize-cli db:migrate:undo
pnpm exec sequelize-cli db:seed:all
```

There are no automated tests in this project.

---

## Architecture & Modular Design

Express.js + TypeScript backend running on port 3001. All routes are prefixed with `/api`.

This API is built as **independent modules** that can be used together or separately. A deployment may activate only the modules relevant to its use case, and modules can reference each other (e.g. a booking business that also sells products just wires in the ecommerce module).

```
index.ts → applySecurity() → applyParsers() → /api routes → controller
```

- `src/middleware/security.ts` — Helmet, CORS (from `CORS_ORIGINS` env), rate limit (100 req/min), DOMPurify sanitization on string body fields
- `src/middleware/parsers.ts` — cookie-parser, body-parser (JSON + urlencoded), express-fileupload (5 MB limit)
- `src/middleware/auth.ts` — Three JWT strategies + RBAC middleware

---

## Modules

### 1. Admin / Backoffice

Admin panel for managing the platform. Always present — it's the backbone that controls users, permissions, and RBAC.

**Routes prefix:** `/api/` (no domain prefix for backoffice)

| Path | Permission | Description |
|------|-----------|-------------|
| `/users` | public (login only) | Admin authentication |
| `/userpermissions` | `authenticateToken` | Assign permissions to users |
| `/permissions` | `VIEW_ADMIN` | Manage permission definitions |
| `/components` | `VIEW_ADMIN` | Manage UI components for RBAC |
| `/customers` | `VIEW_CUSTOMERS` | View/manage customer accounts |

**Files:**
```
routes/backoffice/admin/
controllers/backoffice/admin/
```

**Swagger:** `/api-docs/backoffice`

---

### 2. Ecommerce — Backoffice

Product catalogue, category management, order processing.

**Routes prefix:** `/api/`

| Path | Permission | Description |
|------|-----------|-------------|
| `/categories` | `VIEW_PRODUCTS` | Category CRUD |
| `/subcategories` | `VIEW_PRODUCTS` | Subcategory CRUD |
| `/products` | `VIEW_PRODUCTS` | Product CRUD + image upload |
| `/orders` | `VIEW_PRODUCTS` | Order management |
| `/ordersproduct` | `VIEW_PRODUCTS` | Order line items |

**Files:**
```
routes/backoffice/ecommerce/
controllers/backoffice/ecommerce/
```

---

### 3. Ecommerce — Public Website

Customer-facing shopping: cart, checkout, order history.

**Routes prefix:** `/api/websites/ecommerce/`

| Path | Auth | Description |
|------|------|-------------|
| `/products` | `authenticateTokenPublic` | Browse products (public) |
| `/carts` | `authenticateTokenCustomers` | Cart management |
| `/orders` | `authenticateTokenCustomers` | Place & view orders |

**Files:**
```
routes/websites/ecommerce/
controllers/websites/ecommerce/
```

**Swagger:** `/api-docs/websites/ecommerce`

---

### 4. Customers — Public Website

Customer registration, login, profile, addresses, payment cards.

**Routes prefix:** `/api/websites/customers/`

| Path | Auth | Description |
|------|------|-------------|
| `/autentication` | `authenticateTokenPublic` | Register, login (Google + email), profile |
| `/addresses` | `authenticateTokenCustomers` | Address book |
| `/bankcards` | `authenticateTokenCustomers` | Saved payment cards (no CVV stored) |

**Files:**
```
routes/websites/customers/
controllers/websites/customers/
```

**Swagger:** `/api-docs/websites/customers`

---

### 5. Schedule — Backoffice

Admin panel for managing the booking calendar: define services, set working hours, block slots, manage appointments.

Applies to any service business: barbershops, hair salons, nail studios, car showrooms, etc. The "provider" is always identified by `userId`.

**Routes prefix:** `/api/schedule/`

| Path | Permission | Description |
|------|-----------|-------------|
| `/services` | `VIEW_SCHEDULE` | CRUD for offered services (name, duration, price) |
| `/appointments` | `VIEW_SCHEDULE` | View & manage bookings, filter by date/month/status |
| `/working-hours` | `VIEW_SCHEDULE` | Set open hours per day of week (upsert batch) |
| `/blocked-slots` | `VIEW_SCHEDULE` | Block full days or time ranges |

**Files:**
```
routes/backoffice/schedule/
controllers/backoffice/schedule/
```

**Swagger:** included in `/api-docs/backoffice`

---

### 6. Booking — Public Website

Public booking flow for end customers. Zero authentication required — the provider is identified by `userId` in the query/body.

Works for **any service type**: barbershops, hairdressers, nail studios, physiotherapy, car services, etc.

**Routes prefix:** `/api/websites/booking/`

| Path | Auth | Description |
|------|------|-------------|
| `GET /services?userId=` | none | List active services for a provider |
| `GET /slots?userId=&date=&serviceId=` | none | Available time slots (respects working hours, existing bookings, blocked slots) |
| `POST /appointments` | none | Create a booking — sends confirmation email + cancel link to client, notification to provider |
| `GET /appointments/:cancelToken` | none | View booking details |
| `PATCH /appointments/:cancelToken/cancel` | none | Cancel a booking — sends cancellation email |

**Files:**
```
routes/websites/booking/
controllers/websites/booking/
```

**Swagger:** `/api-docs/websites/booking`

**Environment variable:** `BOOKING_SITE_URL` — base URL of the frontend, used to generate the cancel link in confirmation emails (default: `http://localhost:5173`). The business name in emails is read from `User.name` in the database — no env var needed, works for multiple tenants.

---

## Module cross-wiring

Modules are independent but share the same DB and auth layer. Cross-wiring examples:

- A barbershop that **also sells products** → activate both `booking` and `ecommerce` modules. No code changes needed; they share the `User` model via `userId`.
- A customer who has both a shop account and a booking → `Customer` (ecommerce) and booking's `clientEmail`/`clientPhone` are separate on purpose; a unified account login is not required for booking.
- Backoffice `schedule` module manages the provider-side calendar; the public `booking` module is the client-facing API for the same data.

---

## Authentication & Authorization

Three middleware functions:

| Function | Token | Used for |
|----------|-------|---------|
| `authenticateToken` | `JWT_SECRET` | Backoffice admin users |
| `authenticateTokenCustomers` | `JWT_SECRET` | Website customers |
| `authenticateTokenPublic` | `JWT_SECRET_PUBLIC` | Public endpoints with optional identity |

Route protection pattern:
```ts
router.get("/", authenticateToken, authorizePermissions(["VIEW_ADMIN"]), controller);
```

`authorizePermissions(componentNames[])` checks the RBAC system: `UserPermission → Permission → ComponentPermission → Component`. Users with the `Admin` permission bypass component checks entirely.

---

## Models & Database

All models live in `models/` and are initialized in `models/index.ts`. Associations are defined in `models/associations.ts`.

Database config is driven by `ENVIRONMENT` env var (`DEV` or `PROD`). Config file: `config/config.js`.

### Key relationships

```
User (admin)
  ├── Customer (1:M) → Order, Cart, Address, BankCard
  ├── Service (1:M)           — booking module
  ├── Appointment (1:M)       — booking module
  ├── WorkingHours (1:M)      — booking module
  └── BlockedSlot (1:M)       — booking module

Category → Subcategory → Product
Product ↔ Order via OrderProduct (M:M, stores priceAtPurchase)
Product ↔ Cart via CartProduct (M:M)
Permission ↔ Component via ComponentPermission (RBAC)
User ↔ Permission via UserPermission
```

### Booking models

| Model | Table | Key fields |
|-------|-------|-----------|
| `Service` | `Services` | `serviceId`, `name`, `duration` (min), `price`, `active`, `userId` |
| `Appointment` | `Appointments` | `appointmentId`, `date`, `time`, `serviceId`, `clientName`, `clientEmail`, `clientPhone`, `status` (pending/confirmed/completed/cancelled), `cancelToken`, `userId` |
| `WorkingHours` | `WorkingHours` | `workingHoursId`, `dayOfWeek` (0=Sun), `startTime`, `endTime`, `isActive`, `userId` |
| `BlockedSlot` | `BlockedSlots` | `blockedSlotId`, `date`, `startTime` (null = full day), `endTime`, `reason`, `userId` |

---

## Swagger

| URL | Module | Auth required |
|-----|--------|--------------|
| `/api-docs/backoffice` | Admin + Schedule | Yes (20 min window in PROD) |
| `/api-docs/websites/customers` | Customers | Yes (20 min window in PROD) |
| `/api-docs/websites/ecommerce` | Ecommerce public | Yes (20 min window in PROD) |
| `/api-docs/websites/booking` | Booking public | No |

Each spec also available as JSON at the same path + `.json`.

---

## File uploads

Static files served from `/uploads`. Upload handling via `express-fileupload`, image processing via `sharp`. Uploads are excluded from TypeScript compilation.

---

## Environment variables

Required at startup (will throw if missing):
- `JWT_SECRET` — admin token signing
- `JWT_SECRET_PUBLIC` — public/site token signing
- `STRIPE_SECRET_KEY` — Stripe integration

Other required vars:
- `CORS_ORIGINS` — allowed origins
- `EMAIL`, `PASSWORD` — SMTP credentials (Hostinger)
- `GOOGLE_CLIENT_ID` — OAuth
- `DB_*_DEV` or `DB_*_PROD` — database connection (depends on `ENVIRONMENT`)

Booking module:
- `BOOKING_SITE_URL` — frontend base URL for cancel links (default: `http://localhost:5173`)

---

## TypeScript path alias

`@/*` maps to `src/*`. Use for imports from `src/types`, `src/middleware`, etc.

---

## Adding a new module

1. Decide domain: `backoffice/` (admin-only) or `websites/` (public/customer)
2. Create `controllers/<domain>/<module>/` and `routes/<domain>/<module>/`
3. If the module needs a Swagger spec, create `swagger/<domain>/<module>/swagger<Module>.ts` and register it in `swagger/index.ts`
4. Register the routes in `routes/index.ts` with the appropriate auth middleware
5. If new RBAC component needed, add a permission component and seed it
