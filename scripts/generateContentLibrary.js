import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_dashboard',
});

const query = (text, params) => pool.query(text, params);

// Comprehensive content library covering all roles, industries, and departments
const contentLibrary = [
  // DATA ANALYST - Financial Industry
  {
    type: 'prompt',
    title: 'Analyze Financial Transaction Patterns',
    description: 'Write SQL queries and Python analysis for transaction fraud detection',
    roles: ['Data Analyst'],
    industries: ['Finance'],
    departments: ['Analytics'],
    difficulty: 'advanced',
    estimated_time: '15 min',
    tags: ['SQL', 'Python', 'Finance', 'Analytics'],
    content: {
      prompt: 'Create a comprehensive SQL query that analyzes financial transactions to identify suspicious patterns. Include: flagging transactions exceeding 3x average, time-based anomalies, geographic inconsistencies, and rapidly sequential high-value transactions.',
      tips: 'Use window functions for moving averages and variance calculations. Consider timeframe windows of 24h, 7d, and 30d for different anomaly types.'
    }
  },
  {
    type: 'tutorial',
    title: 'Building Risk Dashboards with AI',
    description: 'Step-by-step guide to creating automated risk dashboards',
    roles: ['Data Analyst'],
    industries: ['Finance'],
    departments: ['Analytics'],
    difficulty: 'intermediate',
    estimated_time: '20 min',
    tags: ['Dashboard', 'Risk', 'Analytics'],
    content: {
      steps: [
        { title: 'Set up data sources', content: 'Connect to transaction databases and pull 6 months of historical data' },
        { title: 'Define risk metrics', content: 'Use AI to identify top 20 risk indicators from domain experts' },
        { title: 'Create aggregations', content: 'Build hourly aggregations of key metrics using your data warehouse' },
        { title: 'Configure alerts', content: 'Set up AI-powered alert thresholds that learn from historical patterns' },
        { title: 'Build visualization', content: 'Create interactive dashboards with drill-down capabilities' }
      ]
    }
  },
  {
    type: 'caseStudy',
    title: 'JPMorgan Risk Reduction',
    description: 'How JPMorgan reduced fraud by 40% with AI analytics',
    roles: ['Data Analyst'],
    industries: ['Finance'],
    departments: ['Analytics'],
    difficulty: 'beginner',
    estimated_time: '10 min',
    tags: ['Case Study', 'Risk', 'ML'],
    content: {
      challenge: 'Detecting financial fraud in millions of daily transactions with high accuracy while minimizing false positives',
      solution: 'Implemented AI-powered anomaly detection using transaction patterns, combining rule-based systems with ML models',
      results: '40% reduction in fraud, 60% decrease in false positives',
      keyTakeaway: 'Combine traditional rules with ML for financial risk; domain expertise + AI works better than either alone'
    }
  },

  // MANAGER - Tech Industry
  {
    type: 'prompt',
    title: 'Create Team Performance Review Framework',
    description: 'Design a fair performance review system using AI insights',
    roles: ['Manager'],
    industries: ['Tech'],
    departments: ['HR'],
    difficulty: 'intermediate',
    estimated_time: '12 min',
    tags: ['HR', 'Performance', 'Management'],
    content: {
      prompt: 'Design a performance review framework that considers: code contributions, collaboration metrics, documentation quality, mentoring impact, and innovation contributions. How would you weight each? What metrics would you use? How do you avoid bias?',
      tips: 'Use AI to analyze neutral metrics first (commits, PR reviews, test coverage), then add qualitative feedback. Avoid using AI for final ratings—use it for data synthesis only.'
    }
  },
  {
    type: 'prompt',
    title: 'Automate Team Standup Notes',
    description: 'Use AI to synthesize standup updates and identify blockers',
    roles: ['Manager'],
    industries: ['Tech'],
    departments: ['Operations'],
    difficulty: 'beginner',
    estimated_time: '8 min',
    tags: ['Automation', 'Meeting', 'Notes'],
    content: {
      prompt: 'You have 10 team members sharing standup updates in Slack. Create a prompt that: summarizes progress, identifies all blockers, flags risks, and suggests unblocking actions. Structure it so you can read the digest in 2 minutes.',
      tips: 'Ask AI to use emojis for quick scanning (✅ progress, 🚫 blocker, ⚠️ risk). Include only actionable items for the manager.'
    }
  },

  // ENGINEER - Tech Industry
  {
    type: 'prompt',
    title: 'Debug Production Issues Faster',
    description: 'Use AI to analyze logs and suggest fixes',
    roles: ['Engineer'],
    industries: ['Tech'],
    departments: ['Engineering'],
    difficulty: 'intermediate',
    estimated_time: '10 min',
    tags: ['Debugging', 'DevOps', 'Logs'],
    content: {
      prompt: 'Analyze these error logs and suggest the root cause and fix: [paste logs]. Include: 1) Probable root cause, 2) Verification steps, 3) Recommended fix, 4) Prevention strategies, 5) Similar issues in codebase to check.',
      tips: 'Provide logs in full context. AI works best with timestamps, error traces, and relevant config. Ask for multiple hypotheses ranked by likelihood.'
    }
  },
  {
    type: 'prompt',
    title: 'Generate API Documentation',
    description: 'Auto-generate comprehensive API docs from code',
    roles: ['Engineer'],
    industries: ['Tech'],
    departments: ['Engineering'],
    difficulty: 'beginner',
    estimated_time: '7 min',
    tags: ['Documentation', 'API', 'Automation'],
    content: {
      prompt: 'Here\'s my API code. Generate OpenAPI 3.0 spec, usage examples for Python/JavaScript/Go, error codes with explanations, and authentication details. Make it ready for developer.example.com/api.',
      tips: 'Include request/response examples. Add rate limiting info. Highlight deprecated endpoints. Make examples copy-paste ready.'
    }
  },

  // DESIGNER - Tech Industry
  {
    type: 'prompt',
    title: 'Generate Design System Tokens',
    description: 'Create consistent design tokens from Figma',
    roles: ['Designer'],
    industries: ['Tech'],
    departments: ['Design'],
    difficulty: 'beginner',
    estimated_time: '8 min',
    tags: ['Design', 'Figma', 'Tokens'],
    content: {
      prompt: 'Export my Figma colors, typography, spacing, and shadows. Generate: 1) CSS custom properties, 2) Tailwind config, 3) iOS/Android design tokens, 4) JSON for documentation.',
      tips: 'Be specific about naming conventions. Include accessibility contrast ratios. Add dark mode variants. Export as code engineers can use directly.'
    }
  },

  // MARKETER - Retail Industry
  {
    type: 'prompt',
    title: 'Personalize Email Campaigns with AI',
    description: 'Create dynamic email content based on customer data',
    roles: ['Marketer'],
    industries: ['Retail'],
    departments: ['Marketing'],
    difficulty: 'intermediate',
    estimated_time: '15 min',
    tags: ['Email', 'Personalization', 'Marketing'],
    content: {
      prompt: 'Create email templates for: 1) First-time buyers, 2) Lapsed customers, 3) High-value repeat buyers, 4) Cart abandoners. For each: subject line, opening, product recommendations (3 dynamic), CTA, and footer. Personalize using {{firstName}}, {{lastPurchaseCategory}}, etc.',
      tips: 'A/B test subject lines. Use purchase history for recommendations. Keep CTR high with urgency when needed. Track click-through and conversion separately.'
    }
  },

  // CEO - Tech Industry
  {
    type: 'prompt',
    title: 'Analyze Competitor Strategy with AI',
    description: 'Extract insights from competitor public data',
    roles: ['CEO'],
    industries: ['Tech'],
    departments: ['Product'],
    difficulty: 'advanced',
    estimated_time: '20 min',
    tags: ['Strategy', 'Competitive Analysis', 'Business'],
    content: {
      prompt: 'Analyze our top 5 competitors (public data only): 1) Product positioning, 2) Feature roadmap signals, 3) Customer segments targeted, 4) Pricing strategy, 5) Marketing messaging. Identify: gaps we can exploit, markets they\'re entering, and threats to our position.',
      tips: 'Use SEC filings, product changelogs, marketing assets, and customer reviews. Focus on differentiation opportunities. Avoid any private/confidential info.'
    }
  },

  // SALES REP - Retail
  {
    type: 'prompt',
    title: 'Qualify Leads with AI Assistant',
    description: 'Use AI to score and prioritize leads',
    roles: ['Sales Rep'],
    industries: ['Retail'],
    departments: ['Sales'],
    difficulty: 'beginner',
    estimated_time: '8 min',
    tags: ['Sales', 'Lead Scoring', 'CRM'],
    content: {
      prompt: 'Create a lead qualification prompt: Given [company info, engagement level, company size, decision-making timeline], score from 1-10. Also provide: suggested opening, objection handling, and next steps.',
      tips: 'Focus on buying signals: timeline mentioned, budget approved, competitive pressure. Weight recency of engagement heavily.'
    }
  },

  // HR MANAGER - Manufacturing
  {
    type: 'prompt',
    title: 'Draft Job Descriptions Using AI',
    description: 'Generate inclusive, detailed job descriptions',
    roles: ['HR Manager'],
    industries: ['Manufacturing'],
    departments: ['HR'],
    difficulty: 'beginner',
    estimated_time: '10 min',
    tags: ['HR', 'Recruiting', 'Job Description'],
    content: {
      prompt: 'Create a job description for [role] at [company]. Include: summary, key responsibilities (8-10), required skills, nice-to-haves, benefits, reporting structure, and growth opportunities. Make it inclusive and remove any gendered language.',
      tips: 'Use action verbs. Be specific about skills (e.g., "SQL and Python" not "technical skills"). Include salary range where possible.'
    }
  },

  // PRODUCT MANAGER - Healthcare
  {
    type: 'prompt',
    title: 'Write PRDs with AI Assistance',
    description: 'Create product requirement documents faster',
    roles: ['Product Manager'],
    industries: ['Healthcare'],
    departments: ['Product'],
    difficulty: 'intermediate',
    estimated_time: '25 min',
    tags: ['Product', 'PRD', 'Strategy'],
    content: {
      prompt: 'Help me write a PRD for [feature name]. Include: problem statement, user personas, success metrics, requirements (must-have/nice-to-have), edge cases, and open questions. Format for engineering and design reviews.',
      tips: 'Start with user problems, not solutions. Define what "success" means measurably. Flag risky assumptions. Include timeline and dependencies.'
    }
  },

  // HEALTHCARE-SPECIFIC CONTENT
  {
    type: 'prompt',
    title: 'Automate Medical Report Summaries',
    description: 'Summarize patient records for quick review',
    roles: ['Data Analyst'],
    industries: ['Healthcare'],
    departments: ['Analytics'],
    difficulty: 'intermediate',
    estimated_time: '12 min',
    tags: ['Healthcare', 'Compliance', 'Automation'],
    content: {
      prompt: 'Create a prompt to summarize patient medical records: extract key vitals, current medications, recent diagnoses, allergies, and recommended follow-ups. Format for quick clinician review (max 2 screens). Note: ensure HIPAA compliance—no verbatim copy of sensitive fields.',
      tips: 'Highlight critical values. Flag drug interactions. Link to standards (ICD-10 codes). Keep timing—indicate how recent each data point is.'
    }
  },

  // EDUCATION-SPECIFIC
  {
    type: 'prompt',
    title: 'Create Personalized Learning Paths',
    description: 'Generate adaptive curriculum content',
    roles: ['Manager'],
    industries: ['Education'],
    departments: ['Product'],
    difficulty: 'intermediate',
    estimated_time: '15 min',
    tags: ['Education', 'Personalization', 'Learning'],
    content: {
      prompt: 'Design a prompt that creates personalized learning paths for students. Input: student level (beginner/intermediate/advanced), learning goal, available time per week. Output: week-by-week curriculum, resource recommendations, quizzes, and progress tracking.',
      tips: 'Adjust difficulty based on quiz results. Mix learning styles (video, text, interactive). Include stretch goals for high performers.'
    }
  },

  // GOVERNMENT-SPECIFIC
  {
    type: 'prompt',
    title: 'Analyze Policy Impact with Data',
    description: 'Quantify effects of government policies',
    roles: ['Data Analyst'],
    industries: ['Government'],
    departments: ['Analytics'],
    difficulty: 'advanced',
    estimated_time: '20 min',
    tags: ['Government', 'Policy', 'Analysis'],
    content: {
      prompt: 'Analyze the impact of [policy] using public data: 1) affected population size, 2) economic impact (estimated), 3) key demographics, 4) regional variation, 5) unintended consequences observed. Use only public, verified data sources.',
      tips: 'Compare before/after metrics. Control for confounding variables. Cite all sources. Quantify uncertainty ranges. Highlight limitations of analysis.'
    }
  },

  // MEDIA/CONTENT CREATION
  {
    type: 'prompt',
    title: 'Generate Content Ideas from Analytics',
    description: 'Data-driven content strategy',
    roles: ['Marketer'],
    industries: ['Media'],
    departments: ['Marketing'],
    difficulty: 'beginner',
    estimated_time: '10 min',
    tags: ['Content', 'Analytics', 'Strategy'],
    content: {
      prompt: 'Analyze our top 20 performing articles. Find patterns: topics, keywords, structure, CTAs, posting times, engagement. Generate 10 new content ideas that follow winning patterns but cover new ground.',
      tips: 'Look at: shares, comments, time-on-page, bounce rate. Identify audience demographics for each piece. Test with A/B variants.'
    }
  },

  // TUTORIALS - MULTI-INDUSTRY
  {
    type: 'tutorial',
    title: 'Getting Started with AI Prompts',
    description: 'Foundations of effective prompt engineering',
    roles: ['Data Analyst', 'Manager', 'Engineer', 'Designer', 'Marketer', 'CEO', 'Sales Rep', 'HR Manager', 'Product Manager'],
    industries: ['Finance', 'Tech', 'Retail', 'Healthcare', 'Manufacturing', 'Education', 'Government', 'Media'],
    departments: ['Analytics', 'Operations', 'Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'HR'],
    difficulty: 'beginner',
    estimated_time: '15 min',
    tags: ['Fundamentals', 'Prompts', 'Tutorial'],
    content: {
      steps: [
        { title: 'Understand the basics', content: 'AI works best with clear context. Think: role, task, constraints, output format.' },
        { title: 'Provide examples', content: 'Show what good output looks like. One example is worth 100 instructions.' },
        { title: 'Ask for structured output', content: 'Use JSON, bullet points, or tables. Specify tone (formal, casual, technical).' },
        { title: 'Iterate and refine', content: 'First output might not be perfect. Refine: "More concise", "Add examples", "Different angle".' },
        { title: 'Test consistently', content: 'Save good prompts. Test variations. Measure results.' }
      ]
    }
  },

  {
    type: 'tutorial',
    title: 'Prompt Engineering Best Practices',
    description: 'Advanced techniques for better outputs',
    roles: ['Engineer', 'Data Analyst', 'Product Manager'],
    industries: ['Tech', 'Finance', 'Healthcare'],
    departments: ['Engineering', 'Analytics', 'Product'],
    difficulty: 'intermediate',
    estimated_time: '20 min',
    tags: ['Advanced', 'Prompts', 'Tutorial'],
    content: {
      steps: [
        { title: 'Chain of thought', content: 'Ask AI to "think step by step". Improves reasoning on complex tasks.' },
        { title: 'Role-play', content: 'Ask AI to assume a role: "You are a senior architect. Review this design."' },
        { title: 'Constraints', content: 'Use format requirements: "Max 5 bullets", "Code only, no explanations"' },
        { title: 'Handling uncertainty', content: 'Ask "What assumptions are you making?" to catch mistakes early.' },
        { title: 'Few-shot learning', content: 'Show 2-3 examples of input→output pairs for complex tasks.' }
      ]
    }
  },

  // CASE STUDIES - VARIOUS INDUSTRIES
  {
    type: 'caseStudy',
    title: 'Netflix Recommendation Engine',
    description: 'How Netflix uses AI for personalization',
    roles: ['Data Analyst', 'Product Manager', 'Manager'],
    industries: ['Media', 'Tech'],
    departments: ['Analytics', 'Product', 'Operations'],
    difficulty: 'intermediate',
    estimated_time: '12 min',
    tags: ['Case Study', 'Personalization', 'ML'],
    content: {
      challenge: 'Recommend content to 250M+ users with varying tastes, no two sessions identical',
      solution: 'Multi-model approach: collaborative filtering, content-based filtering, ML models trained on watch history, time-of-day patterns',
      results: 'Drives 80% of viewing; saves $1B+ in content strategy annually by predicting hits',
      keyTakeaway: 'Personalization at scale requires ensemble methods. No single model is best for everyone.'
    }
  },

  {
    type: 'caseStudy',
    title: 'Amazon Supply Chain Optimization',
    description: 'AI-driven inventory and logistics',
    roles: ['Manager', 'Data Analyst'],
    industries: ['Retail'],
    departments: ['Operations', 'Analytics'],
    difficulty: 'advanced',
    estimated_time: '15 min',
    tags: ['Case Study', 'Operations', 'ML'],
    content: {
      challenge: 'Optimize inventory across 150+ fulfillment centers serving 100M+ customers globally',
      solution: 'Demand forecasting with Prophet/LSTM, dynamic routing, inventory pre-positioning based on regional patterns',
      results: '2-day delivery standard; 30% reduction in excess inventory; faster response to trends',
      keyTakeaway: 'Predictive models are only useful if operationalized. Success = model + systems + people.'
    }
  },

  {
    type: 'caseStudy',
    title: 'Goldman Sachs Algorithmic Trading',
    description: 'ML in high-frequency trading',
    roles: ['Data Analyst', 'Engineer'],
    industries: ['Finance'],
    departments: ['Analytics', 'Engineering'],
    difficulty: 'advanced',
    estimated_time: '18 min',
    tags: ['Case Study', 'Finance', 'ML'],
    content: {
      challenge: 'Predict market movements with 100ms latency and execute trades profitably at scale',
      solution: 'ML models on tick-by-tick data, real-time feature engineering, risk controls, ensemble approach',
      results: '30-50% annual returns on managed funds; powers billions in daily trading',
      keyTakeaway: 'In finance, speed matters. Interpretation and risk management matter more than accuracy.'
    }
  },

  {
    type: 'caseStudy',
    title: 'Uber Dynamic Pricing Algorithm',
    description: 'Surge pricing meets ML',
    roles: ['Manager', 'Data Analyst', 'Product Manager'],
    industries: ['Retail', 'Tech'],
    departments: ['Operations', 'Analytics', 'Product'],
    difficulty: 'intermediate',
    estimated_time: '12 min',
    tags: ['Case Study', 'Pricing', 'ML'],
    content: {
      challenge: 'Balance supply/demand across 70+ cities, optimize for driver utilization and customer satisfaction',
      solution: 'Real-time demand prediction, driver availability modeling, competitor pricing, customer elasticity models',
      results: 'Increased driver earnings 3-5x, reduced wait times by 40%, improved customer retention',
      keyTakeaway: 'Algorithmic pricing needs guardrails. Price too high = customer backlash. Price too low = driver churn.'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive content seeding...');

    // Clear existing content
    await query('DELETE FROM content');
    console.log('✓ Cleared existing content');

    // Insert all content
    let inserted = 0;
    for (const item of contentLibrary) {
      const result = await query(
        `INSERT INTO content (type, title, description, roles, industries, difficulty, estimated_time, content, tags, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         RETURNING id`,
        [
          item.type,
          item.title,
          item.description,
          JSON.stringify(item.roles),
          JSON.stringify(item.industries),
          item.difficulty,
          item.estimated_time,
          JSON.stringify(item.content),
          JSON.stringify(item.tags)
        ]
      );
      inserted++;
      if (inserted % 10 === 0) {
        console.log(`  ✓ Inserted ${inserted} items...`);
      }
    }

    console.log(`\n✅ Successfully seeded ${inserted} content items!`);
    console.log(`\n📊 Breakdown:`);
    console.log(`  - Prompts: ${contentLibrary.filter(c => c.type === 'prompt').length}`);
    console.log(`  - Tutorials: ${contentLibrary.filter(c => c.type === 'tutorial').length}`);
    console.log(`  - Case Studies: ${contentLibrary.filter(c => c.type === 'caseStudy').length}`);

    // Verify seeding
    const result = await query('SELECT COUNT(*) as count FROM content');
    console.log(`\n✓ Database verification: ${result.rows[0].count} total content items`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();

// After the contentLibrary array, add more prompts specifically for underrepresented role+industry combinations:

const additionalPrompts = [
  // Data Analyst + Tech Prompts (was missing)
  {
    type: 'prompt',
    title: 'Optimize Database Query Performance',
    description: 'Analyze and optimize slow SQL queries',
    roles: ['Data Analyst'],
    industries: ['Tech'],
    departments: ['Analytics', 'Engineering'],
    difficulty: 'advanced',
    estimated_time: '20 min',
    tags: ['SQL', 'Performance', 'Optimization'],
    content: {
      prompt: 'I have a slow query that joins 5 tables and returns 100k rows in 15 seconds. Analyze this query and suggest optimization strategies: [paste query]. Consider: indexes, query structure, table design.',
      tips: 'Ask AI for: 1) Query execution plan analysis 2) Suggested indexes 3) Alternative join strategies 4) Estimated performance improvement'
    }
  },
  {
    type: 'prompt',
    title: 'Create Cohort Analysis Report',
    description: 'Analyze user cohorts and retention patterns',
    roles: ['Data Analyst'],
    industries: ['Tech'],
    departments: ['Analytics'],
    difficulty: 'intermediate',
    estimated_time: '18 min',
    tags: ['Analysis', 'Cohorts', 'SQL'],
    content: {
      prompt: 'Create a cohort analysis that shows user retention by signup month. Include: cohort size, retention rate by week, churn rate, and visualizations. Use [database/data source].',
      tips: 'Use window functions for cohort assignment. Consider: new vs returning users, seasonal patterns, lifetime value by cohort.'
    }
  },
  {
    type: 'prompt',
    title: 'Build User Segmentation Model',
    description: 'Segment users for targeted analysis',
    roles: ['Data Analyst'],
    industries: ['Tech'],
    departments: ['Analytics', 'Marketing'],
    difficulty: 'intermediate',
    estimated_time: '15 min',
    tags: ['Segmentation', 'Python', 'ML'],
    content: {
      prompt: 'Build a user segmentation model using RFM (Recency, Frequency, Monetary). Cluster users into high/medium/low value segments using [data]. Provide segment profiles and recommendations.',
      tips: 'Use K-means clustering or similar. Define RFM thresholds based on quartiles. Include segment size, characteristics, and business implications.'
    }
  },

  // Additional roles missing Tech content
  {
    type: 'prompt',
    title: 'Design A/B Test Analysis Framework',
    description: 'Set up statistical testing for product experiments',
    roles: ['Product Manager'],
    industries: ['Tech'],
    departments: ['Product'],
    difficulty: 'intermediate',
    estimated_time: '20 min',
    tags: ['Statistics', 'Testing', 'Product'],
    content: {
      prompt: 'Design an A/B testing framework for our product team. Include: sample size calculation, minimum detectable effect, statistical significance threshold, guardrails for negative impacts, and decision rules.',
      tips: 'Specify power analysis (80% power), false positive rate (5%), and decision-making process. Consider: novelty effects, external validity, multiple testing corrections.'
    }
  },

  // More coverage for underrepresented combinations
  {
    type: 'prompt',
    title: 'Analyze Marketing Attribution',
    description: 'Multi-touch attribution modeling for campaigns',
    roles: ['Marketer'],
    industries: ['Tech', 'Retail'],
    departments: ['Marketing'],
    difficulty: 'advanced',
    estimated_time: '25 min',
    tags: ['Attribution', 'Marketing', 'Analytics'],
    content: {
      prompt: 'Build a multi-touch attribution model for our marketing channels. Data: [channel data]. Model user journey and calculate contribution of each touchpoint to conversion. Compare attribution models: first-click, last-click, linear, time-decay.',
      tips: 'Use data-driven approach where possible. Show how different models change channel priorities. Recommend channel investment adjustments.'
    }
  },

  {
    type: 'prompt',
    title: 'Forecast Revenue with Seasonality',
    description: 'Time series forecasting for business metrics',
    roles: ['Manager', 'Data Analyst'],
    industries: ['Finance', 'Retail'],
    departments: ['Operations', 'Analytics'],
    difficulty: 'advanced',
    estimated_time: '20 min',
    tags: ['Forecasting', 'TimeSeries', 'Python'],
    content: {
      prompt: 'Build a revenue forecast for next 12 months using historical data [provide data]. Account for: seasonality, trends, holidays, and anomalies. Use Prophet, ARIMA, or similar. Provide: point estimate, confidence intervals, assumptions.',
      tips: 'Decompose time series into trend + seasonality + residuals. Validate with backtesting. Include sensitivity analysis for key assumptions.'
    }
  }
];
