# RunCrew

Group running scheduler. Create or join running groups, schedule runs, view them by week or list.

## Setup

1. Copy the config template and fill in your [Supabase](https://supabase.com) project credentials:
   ```
   cp js/config.example.js js/config.js
   ```
2. Serve the project locally (required for ES modules):
   ```
   npx serve .
   # or: python3 -m http.server 8080
   ```
3. Open `http://localhost:3000` (or whichever port the server uses).

## Database

Migrations are managed with the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
# Install CLI
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Apply migrations to remote
supabase db push

# Create a new migration
supabase migration new <migration_name>

# Reset local DB (re-applies all migrations from scratch)
supabase db reset
```

Migrations live in `supabase/migrations/`.

## Deploy to Vercel

Set these environment variables in your Vercel project settings:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |

Then connect the repo to Vercel — `vercel.json` handles the build and security headers.
