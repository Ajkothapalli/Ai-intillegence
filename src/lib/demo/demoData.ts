export type IndustryKey = 'saas_b2c' | 'marketplace' | 'ecommerce' | 'fintech' | 'healthtech' | 'other'

export type DemoProjectData = {
  name: string
  description: string
  app_url: string
  target_audience: string
  funnel_stages: string[]
  primary_metric: string
  business_goal: string
  demoCSV: string
  recommendation: {
    hypothesis: string
    evidence: string[]
    confidence: number
    priority: number
    experiment_type: 'A/B Test' | 'Multivariate' | 'Feature Flag' | 'Holdout' | 'Bandit'
    rationale: string
    pm_summary: string
  }
}

const DEMO_DATA: Record<IndustryKey, DemoProjectData> = {
  saas_b2c: {
    name: 'SaaS Onboarding Funnel (Demo)',
    description: 'Demo project showing typical SaaS B2C activation funnel analysis',
    app_url: 'https://app.example-saas.com',
    target_audience: 'Indie developers and small teams looking to automate workflows',
    funnel_stages: ['Landing Page', 'Signup', 'Email Verification', 'Profile Setup', 'Connect Integration', 'First Action', 'Aha Moment', 'Day-7 Retention'],
    primary_metric: '7-day activation rate',
    business_goal: 'Increase trial-to-paid conversion from 12% to 18% within Q2',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
Landing Page,10000,0,0
Signup,6200,38,45
Email Verification,4900,21,180
Profile Setup,3800,22,240
Connect Integration,1900,50,420
First Action,1200,37,300
Aha Moment,680,43,600
Day-7 Retention,490,28,0`,
    recommendation: {
      hypothesis: 'Removing the email verification step for Google OAuth signups and auto-verifying via OAuth token will increase activation rate by eliminating the highest drop-off point in the funnel',
      evidence: [
        '38% of users who sign up never complete email verification — the single largest drop in the funnel',
        'Users who sign up via Google OAuth complete email verification 100% of the time but still experience a 45-second delay waiting for a confirmation step that adds no security value for OAuth users',
      ],
      confidence: 0.78,
      priority: 1,
      experiment_type: 'A/B Test',
      rationale: 'Email verification exists to confirm ownership, but OAuth already proves this. Removing this friction for OAuth users directly targets a 38% drop-off with near-zero implementation risk. Teams that remove redundant verification steps see an average 12% lift in activation in the first 30 days.',
      pm_summary: 'Skip the email verification step for Google sign-in users — it\'s redundant friction costing you 38% of signups who never come back.',
    },
  },

  marketplace: {
    name: 'Marketplace Listing Funnel (Demo)',
    description: 'Demo project showing typical two-sided marketplace seller onboarding funnel',
    app_url: 'https://app.example-marketplace.com',
    target_audience: 'Independent sellers wanting to reach new buyers without upfront fees',
    funnel_stages: ['Homepage', 'Seller Signup', 'Identity Verification', 'Create First Listing', 'Add Photos', 'Set Pricing', 'Publish Listing', 'First Sale'],
    primary_metric: 'Seller activation rate (listing published within 7 days)',
    business_goal: 'Grow active seller supply by 40% to meet rising buyer demand',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
Homepage,15000,0,0
Seller Signup,4800,68,90
Identity Verification,3200,33,600
Create First Listing,2100,34,180
Add Photos,1400,33,540
Set Pricing,980,30,300
Publish Listing,620,37,120
First Sale,280,55,0`,
    recommendation: {
      hypothesis: 'Allowing sellers to publish a listing with a single placeholder photo and complete photos later (with an in-app reminder 24 hours later) will increase listings published by removing the largest friction point in the seller journey',
      evidence: [
        '33% of sellers abandon at the "Add Photos" step — 3x longer average time (540s) compared to all other steps indicates photo upload is a genuine blocker',
        'Exit survey data shows 61% of sellers who abandon cite "not having good photos ready" as the primary reason for not completing their listing',
      ],
      confidence: 0.78,
      priority: 1,
      experiment_type: 'Feature Flag',
      rationale: 'Sellers are motivated to list but hit a wall when asked for polished photos immediately. A deferred photo flow with a "publish now, add photos later" option removes the blocker at the exact moment it matters. Marketplaces that implemented placeholder-first flows saw 25-40% more listings published in the first session.',
      pm_summary: 'Let sellers publish with a placeholder photo and prompt them to add real photos within 24 hours — 33% are abandoning because they don\'t have photos ready right now.',
    },
  },

  ecommerce: {
    name: 'E-commerce Checkout Funnel (Demo)',
    description: 'Demo project showing typical e-commerce checkout conversion funnel',
    app_url: 'https://shop.example-ecommerce.com',
    target_audience: 'Fashion-conscious millennials shopping for sustainable clothing online',
    funnel_stages: ['Product Page', 'Add to Cart', 'Cart Review', 'Guest/Login', 'Shipping Info', 'Payment', 'Order Review', 'Confirmation'],
    primary_metric: 'Checkout conversion rate',
    business_goal: 'Increase checkout conversion rate from 2.4% to 3.5% this quarter',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
Product Page,50000,0,0
Add to Cart,12500,75,180
Cart Review,9200,26,120
Guest/Login,5800,37,300
Shipping Info,4200,28,240
Payment,2600,38,420
Order Review,2200,15,90
Confirmation,1900,14,0`,
    recommendation: {
      hypothesis: 'Adding a "Continue as Guest" option prominently above the login form will increase checkout completions by eliminating the forced account creation barrier at the highest drop-off step',
      evidence: [
        '37% of shoppers abandon at the Guest/Login step — the second largest drop in the funnel — with 420-second average dwell time on the payment page suggesting anxiety, not confusion',
        'A/B test data from comparable retailers shows that guest checkout reduces abandonment at authentication steps by an average of 23% while maintaining 71% of email capture rates through post-purchase account creation prompts',
      ],
      confidence: 0.78,
      priority: 1,
      experiment_type: 'A/B Test',
      rationale: 'Forced account creation is one of the most documented causes of checkout abandonment in e-commerce. Moving guest checkout above the fold at the login gate removes the coercive feeling without sacrificing the ability to build a customer relationship after purchase. This is high-confidence because the evidence base for guest checkout is enormous.',
      pm_summary: 'Put "Continue as Guest" front and centre before the login form — 37% of shoppers are leaving because they don\'t want to create an account right now.',
    },
  },

  fintech: {
    name: 'Fintech Onboarding Funnel (Demo)',
    description: 'Demo project showing typical fintech KYC and onboarding funnel',
    app_url: 'https://app.example-fintech.com',
    target_audience: 'Freelancers and solopreneurs who need fast access to financial tools',
    funnel_stages: ['Landing Page', 'Account Creation', 'Phone Verification', 'KYC Document Upload', 'Identity Review Pending', 'Approved', 'Fund Account', 'First Transaction'],
    primary_metric: 'KYC completion rate',
    business_goal: 'Reduce time-to-first-transaction from 4.2 days to under 48 hours',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
Landing Page,8000,0,0
Account Creation,5200,35,120
Phone Verification,4600,12,180
KYC Document Upload,3000,35,900
Identity Review Pending,2200,27,0
Approved,1800,18,0
Fund Account,1100,39,300
First Transaction,820,25,0`,
    recommendation: {
      hypothesis: 'Adding a progress indicator during KYC that shows users exactly how close they are to completing verification will reduce KYC abandonment by addressing the primary reason users stop — uncertainty about how much effort remains',
      evidence: [
        '67% of users drop off at KYC step vs 35% industry median — average time on KYC page is 4.2 minutes (2x longer than all other onboarding steps), indicating users are struggling, not just busy',
        'In-app survey of 340 users who abandoned during KYC found that 58% cited "didn\'t know how long it would take" as their top reason, vs only 22% citing "document not ready"',
      ],
      confidence: 0.78,
      priority: 1,
      experiment_type: 'A/B Test',
      rationale: 'KYC is a necessary but anxiety-inducing step in fintech onboarding. A clear progress indicator reduces perceived effort and cognitive load, making the completion feel achievable. Fintech products that added progress visibility to multi-step identity flows saw a median 19% reduction in drop-off at the KYC stage.',
      pm_summary: 'Show users a step-by-step progress bar during KYC — 58% of abandoners said they left because they didn\'t know how much longer it would take.',
    },
  },

  healthtech: {
    name: 'Healthtech Engagement Funnel (Demo)',
    description: 'Demo project showing typical digital health app onboarding and habit-formation funnel',
    app_url: 'https://app.example-health.com',
    target_audience: 'Adults 30-50 managing chronic conditions who want proactive health tracking',
    funnel_stages: ['App Download', 'Account Setup', 'Health Profile', 'Connect Wearable', 'First Log Entry', 'Review Insights', 'Enable Reminders', 'Week-2 Active'],
    primary_metric: 'Day-14 retention rate',
    business_goal: 'Increase day-14 retention from 18% to 28% to justify app store investment',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
App Download,20000,0,0
Account Setup,13000,35,120
Health Profile,9800,25,480
Connect Wearable,6200,37,360
First Log Entry,4800,23,240
Review Insights,3600,25,300
Enable Reminders,2100,42,180
Week-2 Active,1400,33,0`,
    recommendation: {
      hypothesis: 'Making wearable connection optional at onboarding (with a "Skip for now" option that resurfaces after the first manual log entry) will increase first-log completions by removing the perceived technical barrier for users without supported devices',
      evidence: [
        '37% of users drop off at the "Connect Wearable" step — of these, app analytics show 68% have a compatible device but do not complete pairing in-session, suggesting the problem is motivation and timing, not device availability',
        'Users who complete a manual log entry first convert to wearable connection at 71% within 48 hours versus 43% who try to connect wearable first — suggesting that demonstrating value before asking for setup effort is more effective',
      ],
      confidence: 0.78,
      priority: 1,
      experiment_type: 'A/B Test',
      rationale: 'Requiring device pairing before a user has experienced any product value is asking for commitment before trust is established. A "skip + resurface" pattern lets users experience the core value loop first, dramatically increasing willingness to complete setup. This pattern is well-validated in consumer health apps and directly targets the highest drop-off in this funnel.',
      pm_summary: 'Make wearable pairing skippable at onboarding and resurface it after the user logs their first data point manually — 37% are leaving before they\'ve experienced any value.',
    },
  },

  other: {
    name: 'Consumer App Onboarding Funnel (Demo)',
    description: 'Demo project showing a typical consumer digital product onboarding and activation funnel',
    app_url: 'https://app.example-product.com',
    target_audience: 'Everyday consumers looking to solve a specific problem quickly with a mobile or web app',
    funnel_stages: ['App / Site Visit', 'Sign Up', 'Onboarding Step 1', 'Onboarding Step 2', 'Core Feature Used', 'Value Moment', 'Notification Opt-in', 'Day-7 Return'],
    primary_metric: 'Day-7 retention rate',
    business_goal: 'Increase day-7 return visits from 22% to 35% by improving early activation',
    demoCSV: `stage,users,drop_off_rate,avg_time_seconds
App / Site Visit,25000,0,0
Sign Up,9500,62,60
Onboarding Step 1,7600,20,120
Onboarding Step 2,4900,36,240
Core Feature Used,3200,35,300
Value Moment,2100,34,480
Notification Opt-in,1100,48,30
Day-7 Return,770,30,0`,
    recommendation: {
      hypothesis: 'Collapsing the two-step onboarding into a single personalisation screen and deferring notification opt-in until after the user reaches the value moment will increase day-7 retention by ensuring users experience the core benefit before any friction',
      evidence: [
        '36% of users abandon between Onboarding Step 1 and Step 2, and a further 48% decline notification opt-in — together these two steps account for the majority of pre-value drop-off',
        'Session recordings show users who complete both onboarding steps in under 90 seconds are 2.4× more likely to reach the Value Moment than those who take longer, suggesting perceived length of setup is the primary barrier',
      ],
      confidence: 0.76,
      priority: 1,
      experiment_type: 'A/B Test',
      rationale: 'Multi-step onboarding raises perceived effort before users have any reason to trust the product. Consolidating setup into one short step — and asking for notifications only after the user has seen value — removes the two biggest barriers in sequence. Products that moved notification prompts post-value-moment see opt-in rates 30–50% higher while simultaneously improving day-7 retention.',
      pm_summary: 'Merge your two onboarding steps into one and move the notification prompt to after the user has experienced your core value — you\'re losing 36% of signups before they even get there.',
    },
  },
}

export function getDemoData(industry: string): DemoProjectData {
  return DEMO_DATA[industry as IndustryKey] ?? DEMO_DATA.other
}

export const INDUSTRY_LABELS: Record<IndustryKey, string> = {
  saas_b2c:    'SaaS B2C',
  marketplace:  'Marketplace',
  ecommerce:    'E-commerce',
  fintech:      'Fintech',
  healthtech:   'Healthtech',
  other:        'Other',
}
