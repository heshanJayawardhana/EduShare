# EduShare — codebase guide

This document describes what each major part of the **frontend** (Vite + React) and **backend** (Express + MongoDB) does.  
`src/components/ui/*` are mostly **shadcn/ui** primitives (buttons, dialogs, etc.) — thin wrappers around Radix + Tailwind; they are not listed individually.

---

## Backend (`backend/`)

| File | Purpose |
|------|---------|
| `server.js` | Express app: env, CORS, JSON body, `/health`, mounts `/api/payments`, connects MongoDB, seeds demo data if DB is empty. |
| `routes/paymentRoutes.js` | Defines payment API routes and Zod schemas for request bodies. |
| `controllers/paymentController.js` | Business logic for checkout, transactions, withdrawals. |
| `middleware/authMiddleware.js` | `x-user-id` header → load user; role checks. |
| `middleware/validateMiddleware.js` | Zod validation wrapper for `req.body`. |
| `models/*.js` | Mongoose schemas for User, Resource, Transaction, Withdrawal. |

### `server.js` — functions

- **`seedIfEmpty()`** — If the `users` collection has **zero** documents, inserts demo `seedUsers`, `seedResources`, and `seedTransactions`. Skips entirely if any user exists (avoids re-seeding production-like DBs on every restart in the simple guard form).

### `routes/paymentRoutes.js`

- **`checkoutSchema`** (Zod) — Validates POST `/checkout`: `paymentMethod`, `items[]`, optional `card` with rules for card vs PayPal.
- **`transactionStatusSchema`** — Validates PATCH body for admin status updates.
- **Routes** — Wire `GET/POST/PATCH` to controller + middleware chain.

### `controllers/paymentController.js`

| Function | What it does |
|----------|----------------|
| **`todayString()`** | Returns `YYYY-MM-DD` for transaction dates. |
| **`toTransactionDto(t)`** | Maps DB document to a safe JSON shape for the API (no internal fields). |
| **`checkout`** | Validates resources exist and are `verified`, creates pending `Transaction` rows per cart line, returns 201 + DTOs. |
| **`updateTransactionStatus`** | Admin-only: moves transaction `pending` → `verified`/`paid` with allowed transitions. |
| **`getTransactions`** | Admin sees all; students see rows where they are buyer or seller. |
| **`withdraw`** | Sums seller’s `paid` transactions minus completed withdrawals; creates a `Withdrawal` for available balance. |
| **`getWithdrawals`** | Lists withdrawals for the logged-in seller (student). |

### `middleware/authMiddleware.js`

| Function | What it does |
|----------|----------------|
| **`requireUser`** | Reads `x-user-id`, loads `User` from DB, sets `req.user = { id, role }` or 401. |
| **`requireRole(roles)`** | Returns middleware that ensures `req.user.role` is in `roles` (403 if not). |

### `middleware/validateMiddleware.js`

| Function | What it does |
|----------|----------------|
| **`validateBody(schema)`** | Returns Express middleware: `safeParse(req.body)`, 400 + flattened errors on failure, else replaces `req.body` with parsed data. |

### Mongoose models

- **`User`** — `id`, `name`, `email`, `role` (`student` \| `admin`).
- **`Resource`** — Sellable item: `id`, `title`, `price`, `uploadedBy`, `status` (`pending` \| `verified` \| `rejected`).
- **`Transaction`** — Purchase record: amounts, buyer/seller, `status`, optional card metadata (demo only).
- **`Withdrawal`** — Seller cash-out record linked to earnings logic.

---

## Frontend (`src/`)

### Entry & shell

| File | What it does |
|------|----------------|
| **`main.tsx`** | React 18 `createRoot` — mounts `<App />` and imports global `index.css`. |
| **`App.tsx`** | Sets up React Query, tooltips, toasters, `AppProvider`, `BrowserRouter`. **`LoginRedirect`** — `/` shows `Login` or redirects logged-in users to admin vs student home. **`ProtectedRoutes`** — requires `currentUser`; renders student or admin route trees inside `AppLayout`. |
| **`context/AppContext.tsx`** | Global app state: mock users/resources/transactions, cart, notifications; **login** is client-side mock; **checkout / transactions / withdrawals** call the real backend when `VITE_API_BASE_URL` (default `http://localhost:5000`) is reachable. |

### `AppContext.tsx` — functions (what each does)

| Function | Purpose |
|----------|---------|
| **`useApp()`** | Hook to read context; throws if used outside `AppProvider`. |
| **`login(email, password)`** | Simulated delay; finds user in `mockData` by email+password; sets `currentUser`. |
| **`logout()`** | Clears user and cart. |
| **`addToCart(resourceId)`** | Adds one line item (qty 1) if not already in cart. |
| **`removeFromCart(resourceId)`** | Removes line from cart. |
| **`clearCart()`** | Empties cart. |
| **`addNotification(message, type)`** | Prepends a notification bubble for the UI. |
| **`loadPaymentData()`** | GETs `/api/payments/transactions` and `/withdrawals` with `x-user-id`; merges into state (fails silently if API down). |
| **`checkout(payload)`** | POST `/api/payments/checkout` with cart items + payment method; clears cart; refreshes payment data; adds payment notifications. |
| **`markNotificationRead(id)`** | Sets `read: true` on one notification. |
| **`updateResourceStatus(id, status)`** | Local mock: updates resource status (admin verify flow in UI). |
| **`updateTransactionStatus(id, status)`** | PATCH admin transaction status on API; refreshes data; toasts on success. |
| **`addReview(resourceId, rating, comment)`** | Local mock: appends review and recalculates average rating. |
| **`withdrawEarnings()`** | POST `/api/payments/withdraw`; refreshes data; notification on success. |
| **`getBalance()`** | Computes seller totals: paid vs pending vs net after withdrawals (for billing UI). |
| **`unreadCount`** (derived) | Count of notifications with `read === false`. |

### Layout components

| File | What it does |
|------|----------------|
| **`components/AppLayout.tsx`** | Wraps page content in sidebar layout: header with role label, bell → notifications/admin, avatar initials, scrollable `<main>`. |
| **`components/AppSidebar.tsx`** | Role-based nav links (student vs admin), cart/unread badges, **Sign out** calls `logout()`. |
| **`components/NavLink.tsx** | `forwardRef` wrapper around `react-router` `NavLink` with `activeClassName` / `pendingClassName` merged via `cn()`. |
| **`components/StatCard.tsx`** | Reusable metric card: title, value, optional subtitle, icon, color **variant**. |

### `lib/utils.ts`

| Function | What it does |
|----------|----------------|
| **`cn(...inputs)`** | Merges Tailwind classes with `clsx` + `tailwind-merge` (avoids conflicting utilities). |

### `data/mockData.ts`

- Exports **typed demo data**: `users`, `resources`, `transactions`, `notifications`, plus small arrays for charts (`monthlyEarnings`, etc.).
- Used for UI when backend is offline; user login still uses this list.

### Pages (`src/pages/`)

| Page | Role | What it does |
|------|------|----------------|
| **`Login.tsx`** | Public | Email/password form; calls `login()`; navigates to dashboard/admin on success. |
| **`StudentDashboard.tsx`** | Student | Overview stats / quick links using app context. |
| **`Resources.tsx`** | Student | Lists **verified** resources only; search/filter; add paid items to cart. |
| **`Cart.tsx`** | Student | Shows cart lines and total; link to payment. |
| **`Payment.tsx`** | Student | Card/PayPal UI (simulated); validates card fields; calls `checkout()`. |
| **`Billing.tsx`** | Student | Transaction history, balance, withdraw button. |
| **`Notifications.tsx`** | Student | Lists notifications; mark read. |
| **`AdminDashboard.tsx`** | Admin | Admin home / summary. |
| **`AdminUsers.tsx`** | Admin | User listing / management (mock UI). |
| **`AdminVerify.tsx`** | Admin | Approve/reject resources (`updateResourceStatus`). |
| **`AdminPayments.tsx`** | Admin | Review transactions; approve payment steps (`updateTransactionStatus`). |
| **`AdminReports.tsx`** | Admin | Stats / charts from mock + resource counts. |
| **`NotFound.tsx`** | Any | 404 message inside app shell. |
| **`Index.tsx`** | (if used) | Often landing — check router (may redirect). |

### Hooks (`src/hooks/`)

- **`use-toast.ts` / `use-mobile.tsx`** — UI helpers for toasts and responsive sidebar behavior.

### Tests (`src/test/`)

- **`setup.ts`** — Vitest / Testing Library config.
- **`example.test.ts`** — Sample test file.

---

## Environment

**Backend (`backend/.env`)**

- `MONGODB_URI` — Required.
- `PORT` — Optional (default 5000).
- `CLIENT_ORIGIN` — Comma-separated allowed CORS origins (e.g. `http://localhost:5173,http://localhost:8080`).

**Frontend**

- `VITE_API_BASE_URL` — Optional; defaults to `http://localhost:5000` in `AppContext`.

---

## Quick mental model

1. **Login** is entirely **mock** (no backend auth API).
2. **Payments API** is real: identifies users via **`x-user-id`** header matching `User.id` in MongoDB.
3. **Seeding** on backend fills demo users/resources/transactions when the DB is empty (first run).

For questions about a specific file, search this doc or open the file — custom app logic is concentrated in **`AppContext`**, **`pages/*`**, and **`backend/controllers`**.
