export function generateFunnelCSVTemplate(): string {
  const comment = [
    '# Funnel data template for Experiment Intelligence',
    '# stage: name of the funnel step (e.g. "Homepage", "Sign Up", "Checkout")',
    '# users: number of users who reached this step',
    '# drop_off_rate: fraction who did NOT proceed to the next step (0.0 – 1.0)',
    '# avg_time_seconds: average time spent on this step before moving on',
  ].join('\n')

  const headers = 'stage,users,drop_off_rate,avg_time_seconds'

  const rows = [
    'Homepage,50000,0.35,42',
    'Sign Up Page,32500,0.52,87',
    'Email Verification,15600,0.28,240',
    'Onboarding Step 1,11232,0.18,95',
    'Onboarding Step 2,9210,0.22,110',
    'First Core Action,7184,0.31,180',
    'Invite or Share,4957,0.44,65',
    'Paid Conversion,2776,0.00,0',
  ]

  return [comment, headers, ...rows].join('\n')
}
