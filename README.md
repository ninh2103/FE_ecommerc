# E-commerce Admin (React + Vite + Redux Toolkit)

A React admin dashboard for managing authentication, roles/permissions, categories, brands, users, media, etc. Built with Vite, TypeScript, Redux Toolkit, React Hook Form + Zod, and a small UI kit.

## Quick start

1. Install

```bash
pnpm i
# or
npm i
```

2. Configure API base URL and auth storage

- Edit `app/lib/http.ts` if needed (axios client and baseURL)
- Default routes are configured in `app/routes.ts` and `react-router.config.ts`

3. Run dev

```bash
pnpm dev
# or
npm run dev
```

4. Build

```bash
pnpm build
# or
npm run build
```

5. Lint

```bash
pnpm lint
# or
npm run lint
```

## Tech stack

- React 18 + Vite + TypeScript
- Redux Toolkit (async thunks, slices) + `react-redux`
- React Hook Form + Zod (schema-first validation)
- Axios (API client)
- TanStack Table (data tables)
- Shadcn-like UI primitives in `app/components/ui`

## Project structure (key paths)

```
app/
  apiRequest/           # axios API wrappers
  features/             # Redux slices (auth, role, permission, category, brand, media, ...)
  routes/               # Route pages (auth, manage, pages)
    manage/
      category/         # Category CRUD UI
      brand/            # Brand CRUD UI
  validateSchema/       # Zod schemas and types
  lib/                  # http.ts (axios), utils, types
  components/ui/        # UI primitives (button, input, avatar, dialog, table, ...)
  share/ store.ts       # store factory (legacy), prefer app/store.ts
app/store.ts            # Redux store registration
```

## State and types

- Each domain has a Zod schema in `app/validateSchema/*` that drives TypeScript types.
- API wrappers in `app/apiRequest/*` return typed responses (e.g. `GetBrandResType`).
- Slices in `app/features/*Slice.ts` expose async thunks: `getX`, `getXById`, `createX`, `updateX`, `deleteX`.

Example (Category):

- Response list shape: `GetAllCategoriesResType = { data, page, limit, totalItems, totalPages }`
- Item includes translations: `CategoryIncludeTranslationType`

Example (Brand):

- Response list shape: `GetBrandResType = { data, page, limit, totalItems, totalPages }`
- Item includes translations: `BrandIncludeTranslationType`

## Media upload

- `uploadMedia` thunk (in `features/mediaSlice.ts`) accepts a File and returns a URL.
- Forms use an `Avatar` preview. We guard against empty `src` to avoid browser warnings.

## Common workflows

- Category CRUD UI
  - Pages: `app/routes/manage/category/*`
  - Thunks: `features/categorySlice.ts`
  - API: `apiRequest/category.ts`
  - Fields: `name`, `logo` (URL), `parentCategoryId` (nullable), `translations` (array, not edited in forms)

- Brand CRUD UI
  - Pages: `app/routes/manage/brand/*`
  - Thunks: `features/brandSlice.ts`
  - API: `apiRequest/brand.ts`
  - Fields: `name`, `logo` (URL), `translations` (array, not edited in forms)

## Routing

- Main route config: `app/routes.ts` and `react-router.config.ts`
- Admin sections under `/manage/*` (e.g., `/manage/category`, `/manage/brand`)

## Environment

- If your API requires auth headers, ensure token handling in `app/lib/http.ts` is correct.
- CORS and base URL must allow your dev origin.

## Development tips

- When adding new entities, start from an existing slice + schema pair, then copy a CRUD page from `category`/`brand` and adapt fields and thunks.
- Keep Zod schema and API return types in sync to avoid type mismatches in Redux state.

## Scripts

- `dev`: start Vite dev server
- `build`: production build
- `preview`: preview build
- `lint`: run ESLint (see `eslint.config.js`)

## Conventions

- Prefer `CategoryIncludeTranslationType`/`BrandIncludeTranslationType` for list/state where translations exist.
- Never pass empty string to image `src` – pass `undefined` instead (handled in `components/ui/avatar.tsx`).

## License

MIT
