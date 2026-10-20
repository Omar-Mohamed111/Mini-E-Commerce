# AURELLE — Frontend

React + TypeScript + Vite + Tailwind CSS v4 storefront, integrated with the Mini E-Commerce backend API. The backend is read-only from this project's point of view: nothing here requires a backend change for browsing.

## Requirements
- Node.js 20.19+ or 22.12+
- Backend running (MongoDB + Redis + its own `.env`): see the backend project

## Setup (Windows, PowerShell)
```powershell
# 1. Backend (separate terminal)
cd "D:\FullStack\Mini E-Commerce\backend"
npm install
npm run dev                  # note the port it prints, e.g. "Server Running In Port 3000"

# 2. Frontend
cd "D:\FullStack\Mini E-Commerce\frontend"
copy .env.example .env       # then set VITE_PROXY_TARGET to the backend's port
npm install
npm run dev                  # http://localhost:5173
```
The dev server must stay on port **5173** (strict): the backend's CORS policy only allows that origin.

## Environment variables (`.env`, placeholders in `.env.example`)
| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | API base URL the browser uses. `/api` uses the Vite proxy (recommended). An absolute URL such as `http://localhost:3000` calls the backend directly. | `/api` |
| `VITE_PROXY_TARGET` | Dev/preview only: backend address the proxy forwards to (the `/api` prefix is stripped, since the backend has none). | `http://localhost:3000` |

No secrets belong in the frontend. Never copy backend `.env` values here.

## What is connected to the API
| Feature | Endpoint | Notes |
|---|---|---|
| Shop / category listing | `GET /products` | server-side `page`, `limit`, `sort` (`price`/`-price`), `category`, `search` |
| Product details | `GET /products/:id` | routes are `/shop/:id` (the backend has no slugs) |
| Categories | derived from `GET /products` | the backend has no categories endpoint; names are used verbatim for filtering |
| Home "Featured" / spotlight | `GET /products?sort=-price&limit=5` | no "featured" flag exists, so the highest-priced pieces are shown |
| Cart / wishlist prices, names, stock | `GET /products/:id` | only ids + quantities are stored locally |

Structure: `src/api/` (client, mapper, endpoints) · `src/hooks/` (`useAsync`, `useProducts`) · `src/context/` (Catalog, Cart, Wishlist, Theme).
Backend `_id`→`id` and `image` path→URL mapping happens in one place: `src/api/mappers.ts`.

## Limitations (backend capabilities, not frontend omissions)
- Only price sorting exists (no name/newest/featured sorting).
- `search` matches product **name** only. The frontend escapes it so it is a literal match.
- Products have a single image; no gallery, options/variants, tagline or details.
- Cart, checkout and `/auth/me` need a login cookie (`token`). There is no sign-in UI, so the cart is a local guest cart and checkout is an order-review page with a disabled "Place order". Server cart and `POST /orders/checkout` are not wired.
- Currency is assumed to be USD for display; the API returns plain numbers.

## Testing against the backend
1. Start MongoDB, Redis and the backend; confirm `http://localhost:<port>/products` returns JSON.
2. Start the frontend and open `/shop`: products, prices and images should come from your database.
3. Try search, sort and pagination (12 products per page), open a product, add to cart, reload (cart persists), open `/cart`.
4. Stop the backend and reload: the pages show an error state with a retry button.

## Build
```powershell
npm run build     # type-check + production build into dist/
npm run preview   # serves dist/ on :5173 with the same /api proxy
```
For a deployed build, serve `dist/` behind a reverse proxy that forwards `/api` to the backend (stripping the prefix), or set `VITE_API_URL` to the backend URL and configure the backend's CORS for your domain.
