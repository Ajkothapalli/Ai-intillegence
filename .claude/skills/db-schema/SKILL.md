# Skill: db-schema

Use this skill when designing or modifying the Supabase database schema.

## Procedure
1. Read the current migrations in `supabase/migrations/`
2. Consult `design.md` for the target schema
3. Write a new timestamped migration file
4. Add RLS policies in the same migration
5. Update `design.md` if the schema evolves
