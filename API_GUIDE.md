# API Guide (Frontend Proxy)

This guide documents the Next.js API proxy routes used by the frontend and how they map to backend endpoints.

## Overview

- Frontend proxy base: `/api/installers/*`
- Backend base: `${BACKEND_API_BASE_URL}/*`
- Proxy utility: `src/lib/server/backend-authed-fetch.ts`
- Auth mode: bearer token from installer access cookie
- Response mode: raw JSON passthrough via `forwardBackendJson`

## Required Environment Variable

Set this in the frontend runtime environment:

```bash
BACKEND_API_BASE_URL=http://localhost:3000/api/v1
```

## Authentication Behavior

- Installer proxy handlers call `backendAuthedFetch("installer", ...)`.
- If installer access cookie is missing, proxy returns `401 { "message": "Unauthorized." }`.
- If `BACKEND_API_BASE_URL` is missing, proxy returns `500`.

## Leads Proxy Routes

### Collection

- `GET /api/installers/leads` -> `GET /leads` (query string forwarded)
- `POST /api/installers/leads` -> `POST /leads`

### Item

- `GET /api/installers/leads/:id` -> `GET /leads/:id`
- `PATCH /api/installers/leads/:id` -> `PATCH /leads/:id`
- `DELETE /api/installers/leads/:id` -> `DELETE /leads/:id`

### Lead Actions

- `PATCH /api/installers/leads/:id/assign` -> `PATCH /leads/:id/assign`
- `POST /api/installers/leads/:id/convert` -> `POST /leads/:id/convert`

## Customers Proxy Routes

### Collection

- `GET /api/installers/customers` -> `GET /customers` (query string forwarded)
- `POST /api/installers/customers` -> `POST /customers`

### Item

- `GET /api/installers/customers/:id` -> `GET /customers/:id`
- `PATCH /api/installers/customers/:id` -> `PATCH /customers/:id`
- `DELETE /api/installers/customers/:id` -> `DELETE /customers/:id`

## Products Proxy Routes

### Collection

- `GET /api/installers/products` -> `GET /products` (query string forwarded)
- `POST /api/installers/products` -> `POST /products`

### Item

- `GET /api/installers/products/:id` -> `GET /products/:id`
- `PATCH /api/installers/products/:id` -> `PATCH /products/:id`
- `DELETE /api/installers/products/:id` -> `DELETE /products/:id`

## Example Usage

```ts
// Get leads (frontend client call)
const res = await fetch("/api/installers/leads?page=1&limit=10", {
  method: "GET",
  credentials: "include",
});

const payload = await res.json();
```

```ts
// Create customer (frontend client call)
await fetch("/api/installers/customers", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
  }),
});
```

## Notes

- Proxy handlers forward backend status codes and JSON content as-is.
- RBAC is enforced by backend routes, not by the frontend proxy layer.
- For full backend contracts and validation rules, see:
  - `solar_panel_backend/API_DOCUMENTATION.md`
  - `solar_panel_backend/docs/RBAC_ENDPOINT_MATRIX.md`
