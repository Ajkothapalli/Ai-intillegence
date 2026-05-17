# Feature Slice Structure

Each feature lives in `src/features/<name>/` and contains:

```
src/features/<name>/
  components/    # feature-specific React components
  actions.ts     # Next.js server actions
  queries.ts     # Supabase read queries (server-side)
  types.ts       # TypeScript types for this feature
  schema.ts      # Zod validation schemas
```

## Routing
- `src/app/(auth)/` — unauthenticated routes (login, signup)
- `src/app/(app)/` — authenticated routes (dashboard, projects)
- Middleware (`src/middleware.ts`) protects `(app)` routes

## Server Actions Pattern
```typescript
'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(data: ProjectInput) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  // ... insert logic
  revalidatePath('/dashboard')
}
```

## Data Fetching Pattern
```typescript
// In Server Components
import { createServerClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createServerClient()
  const { data } = await supabase.from('projects').select('*')
  return <ProjectList projects={data ?? []} />
}
```
