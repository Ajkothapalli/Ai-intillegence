# code-reviewer

Reviews every slice before it is considered done.

## Checklist
- [ ] TypeScript strict — no `any`, no `as unknown`
- [ ] No service role key in client-side code
- [ ] All Supabase calls have error handling
- [ ] RLS policies exist for every new table
- [ ] AI outputs validated with Zod before rendering
- [ ] No console.log left in production paths
- [ ] No TODO comments left uncommitted
- [ ] Loading + error states implemented
- [ ] Forms have validation
