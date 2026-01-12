# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Logbook is a flight logging application for pilots to track flight hours, aircraft, and statistics. Built with SvelteKit 5 (Svelte 5 with runes), Drizzle ORM, and Better Auth.

## Commands

```bash
bun dev              # Start dev server
bun build            # Production build
bun check            # Type checking with svelte-check
bun lint             # Prettier + ESLint
bun format           # Format with Prettier
bun test             # Run all tests
bun test:unit        # Run unit tests in watch mode

# Database (Drizzle)
bun db:push          # Push schema to database
bun db:generate      # Generate migrations
bun db:migrate       # Run migrations
bun db:studio        # Open Drizzle Studio

# Auth
bun auth:generate    # Generate Better Auth schema types
```

## Architecture

### Remote Functions (Experimental SvelteKit Feature)

Server functions callable from client, located in `src/lib/remotes/`. Uses SvelteKit's experimental `remoteFunctions` feature.

```typescript
import { form, query, getRequestEvent } from "$app/server";

// Query function - fetches data
export const getUser = query(async () => {
	const { request } = getRequestEvent();
	// ...
});

// Form function - handles form submissions with Zod validation
export const signIn = form(signInSchema, async (data, issue) => {
	// issue() for validation errors, use invalid() to return
});
```

### Database Actions

Business logic in `src/lib/server/db/actions/`. Each action is wrapped with `createDbAction()` and takes `(db, userId, ...args)`. Actions work with both direct DB and transactions.

```typescript
export const getOrCreatePilot = createDbAction(async (db, userId: string, name: string) => {
	// ...
});
```

### Route Groups

- `(authed)` - Protected routes requiring session, redirects to `/sign-in`
- `(unauthed)` - Sign-in/sign-up pages

### Key Patterns

- **Temporal API**: Uses `@js-temporal/polyfill` for date/time handling
- **Zod validation**: All forms validated with Zod schemas
- **Multi-tenant**: All data scoped by `userId`
- **shadcn-svelte**: UI components in `src/lib/components/ui/`

## Tech Stack

- **Runtime**: Bun
- **Framework**: SvelteKit with experimental async components and remote functions
- **Database**: LibSQL/Turso (SQLite) with Drizzle ORM
- **Auth**: Better Auth with email/password
- **UI**: Bits UI + shadcn-svelte + Tailwind CSS
- **Testing**: Vitest with Playwright browser testing

## Environment Variables

```
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:5173
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=<turso-token-for-production>
```
