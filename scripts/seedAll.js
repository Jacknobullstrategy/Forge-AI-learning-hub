import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_dashboard',
});

const query = (text, params) => pool.query(text, params);

// MASSIVE content library with better coverage across all roles/industries/departments
const contentLibrary = [
  // DATA ANALYST + TECH - PROMPTS
  { type: 'prompt', title: 'Optimize Database Query Performance', description: 'Analyze slow SQL queries', roles: ['Data Analyst'], industries: ['Tech'], departments: ['Analytics', 'Engineering'], difficulty: 'advanced', estimated_time: '20 min', tags: ['SQL'], content: { prompt: 'Analyze this slow query [paste]. Suggest: indexes, join strategies, explain plan interpretation.', tips: 'Focus on execution time and resource usage.' } },
  { type: 'prompt', title: 'Create Cohort Analysis Report', description: 'User retention and cohort metrics', roles: ['Data Analyst'], industries: ['Tech'], departments: ['Analytics'], difficulty: 'intermediate', estimated_time: '18 min', tags: ['Analysis'], content: { prompt: 'Build cohort retention analysis by signup month. Show: cohort size, week-by-week retention.', tips: 'Use window functions for cohort calculation.' } },
  { type: 'prompt', title: 'Build User Segmentation Model', description: 'RFM segmentation for users', roles: ['Data Analyst'], industries: ['Tech'], departments: ['Analytics'], difficulty: 'intermediate', estimated_time: '15 min', tags: ['Segmentation'], content: { prompt: 'Create RFM segments (Recency, Frequency, Monetary). Cluster users into high/medium/low value.', tips: 'Use K-means clustering with RFM quartiles.' } },
  { type: 'prompt', title: 'Analyze Product Metrics Trends', description: 'Track KPI changes over time', roles: ['Data Analyst'], industries: ['Tech'], departments: ['Analytics', 'Product'], difficulty: 'beginner', estimated_time: '10 min', tags: ['Metrics'], content: { prompt: 'Analyze trends for: DAU, retention, session length. Find breakpoints and anomalies.', tips: 'Use time series decomposition.' } },

  // DATA ANALYST + FINANCE - PROMPTS
  { type: 'prompt', title: 'Analyze Financial Transaction Patterns', description: 'Fraud detection in transactions', roles: ['Data Analyst'], industries: ['Finance'], departments: ['Analytics'], difficulty: 'advanced', estimated_time: '15 min', tags: ['SQL', 'Finance'], content: { prompt: 'Create SQL query for suspicious transaction patterns. Flag: 3x average, time anomalies, geographic inconsistencies.', tips: 'Use window functions for moving averages.' } },
  { type: 'prompt', title: 'Build Credit Risk Model', description: 'Predict loan default probability', roles: ['Data Analyst'], industries: ['Finance'], departments: ['Analytics'], difficulty: 'advanced', estimated_time: '25 min', tags: ['ML', 'Finance'], content: { prompt: 'Create credit risk model using [data]. Predict default probability. Feature importance, ROC curve, calibration.', tips: 'Use logistic regression or gradient boosting.' } },
  { type: 'prompt', title: 'Analyze Portfolio Performance', description: 'Investment return calculations', roles: ['Data Analyst'], industries: ['Finance'], departments: ['Analytics'], difficulty: 'intermediate', estimated_time: '20 min', tags: ['Finance'], content: { prompt: 'Calculate: daily returns, Sharpe ratio, drawdown, alpha vs benchmark for portfolio [data].', tips: 'Annualize returns appropriately.' } },

  // MANAGER + TECH - PROMPTS
  { type: 'prompt', title: 'Create Team Performance Review Framework', description: 'Fair performance evaluation system', roles: ['Manager'], industries: ['Tech'], departments: ['HR'], difficulty: 'intermediate', estimated_time: '12 min', tags: ['HR', 'Management'], content: { prompt: 'Design review framework: metrics (commits, PRs, docs, mentoring), weighting, bias avoidance.', tips: 'Use data-driven metrics first, then qualitative feedback.' } },
  { type: 'prompt', title: 'Automate Team Standup Notes', description: 'AI synthesis of standup updates', roles: ['Manager'], industries: ['Tech'], departments: ['Operations'], difficulty: 'beginner', estimated_time: '8 min', tags: ['Automation'], content: { prompt: 'Summarize 10 team standups. Extract: progress, blockers, risks, action items in 2 min read.', tips: 'Use emojis for quick scanning.' } },
  { type: 'prompt', title: 'Plan Sprint Capacity', description: 'Calculate team velocity and sprint planning', roles: ['Manager'], industries: ['Tech'], departments: ['Operations'], difficulty: 'intermediate', estimated_time: '12 min', tags: ['Planning'], content: { prompt: 'Analyze velocity history. Forecast capacity for next sprint accounting for holidays/sick leave.', tips: 'Use conservative estimates for new team members.' } },

  // ENGINEER + TECH - PROMPTS
  { type: 'prompt', title: 'Debug Production Issues Faster', description: 'Log analysis for root cause', roles: ['Engineer'], industries: ['Tech'], departments: ['Engineering'], difficulty: 'intermediate', estimated_time: '10 min', tags: ['Debugging'], content: { prompt: 'Analyze logs [paste]. Find: root cause, verification steps, fix, prevention, similar issues.', tips: 'Ask for multiple hypotheses ranked by likelihood.' } },
  { type: 'prompt', title: 'Generate API Documentation', description: 'Auto-generate OpenAPI specs', roles: ['Engineer'], industries: ['Tech'], departments: ['Engineering'], difficulty: 'beginner', estimated_time: '7 min', tags: ['Documentation'], content: { prompt: 'Generate OpenAPI 3.0 spec, usage examples (Python/JS/Go), error codes, auth details.', tips: 'Make examples copy-paste ready.' } },
  { type: 'prompt', title: 'Review Code for Security Issues', description: 'Identify vulnerabilities in code', roles: ['Engineer'], industries: ['Tech'], departments: ['Engineering'], difficulty: 'intermediate', estimated_time: '15 min', tags: ['Security'], content: { prompt: 'Review [code] for: SQL injection, XSS, auth issues, secrets in code, dependency vulnerabilities.', tips: 'Check OWASP top 10. Run dependency scanner.' } },

  // MARKETER + RETAIL - PROMPTS
  { type: 'prompt', title: 'Personalize Email Campaigns', description: 'Dynamic email personalization', roles: ['Marketer'], industries: ['Retail'], departments: ['Marketing'], difficulty: 'intermediate', estimated_time: '15 min', tags: ['Email', 'Personalization'], content: { prompt: 'Create templates: first-time buyers, lapsed customers, high-value, cart abandoners with dynamic recommendations.', tips: 'Use {{firstName}}, {{lastCategory}} variables. A/B test subject lines.' } },
  { type: 'prompt', title: 'Optimize Landing Page Copy', description: 'Improve conversion with AI writing', roles: ['Marketer'], industries: ['Retail'], departments: ['Marketing'], difficulty: 'beginner', estimated_time: '12 min', tags: ['Copy', 'Conversion'], content: { prompt: 'Rewrite landing page for [product]. Create: headlines (3 variants), CTAs, value propositions.', tips: 'Focus on benefits, not features. Test headlines.' } },
  { type: 'prompt', title: 'Plan Social Media Content Calendar', description: 'Generate content ideas and schedule', roles: ['Marketer'], industries: ['Retail'], departments: ['Marketing'], difficulty: 'beginner', estimated_time: '10 min', tags: ['Social', 'Planning'], content: { prompt: 'Create 4-week content calendar for [platform]. Include: post types, themes, posting times, CTAs.', tips: 'Mix promotional, educational, entertaining content 80/20.' } },

  // PRODUCT MANAGER + HEALTHCARE - PROMPTS
  { type: 'prompt', title: 'Write PRDs with AI', description: 'Product requirement documents', roles: ['Product Manager'], industries: ['Healthcare'], departments: ['Product'], difficulty: 'intermediate', estimated_time: '25 min', tags: ['Product', 'PRD'], content: { prompt: 'Write PRD for [feature]: problem, personas, metrics, requirements (must/nice), edge cases, questions, timeline.', tips: 'Start with user problems, not solutions.' } },
  { type: 'prompt', title: 'Design A/B Test Framework', description: 'Set up statistical testing', roles: ['Product Manager'], industries: ['Tech'], departments: ['Product'], difficulty: 'intermediate', estimated_time: '20 min', tags: ['Testing', 'Product'], content: { prompt: 'Design A/B test framework: sample size, MDE, significance (80% power, 5% error), guardrails, decision rules.', tips: 'Include novelty effects and external validity concerns.' } },

  // SALES REP + RETAIL - PROMPTS
  { type: 'prompt', title: 'Qualify Leads Effectively', description: 'AI-powered lead scoring', roles: ['Sales Rep'], industries: ['Retail'], departments: ['Sales'], difficulty: 'beginner', estimated_time: '8 min', tags: ['Sales', 'Leads'], content: { prompt: 'Score leads 1-10 based on: company size, engagement, timeline, budget, competition. Suggest: opening, objections, next steps.', tips: 'Weight timeline and budget heavily.' } },
  { type: 'prompt', title: 'Close Complex Deals', description: 'Multi-stakeholder sales strategy', roles: ['Sales Rep'], industries: ['Retail', 'Tech'], departments: ['Sales'], difficulty: 'intermediate', estimated_time: '15 min', tags: ['Sales', 'Strategy'], content: { prompt: 'Map stakeholders for [deal]. Identify: decision maker, influencers, blockers. Suggest influence strategy for each.', tips: 'Tailor value prop per stakeholder.' } },

  // HR MANAGER + MANUFACTURING - PROMPTS
  { type: 'prompt', title: 'Draft Inclusive Job Descriptions', description: 'Write JDs that attract diverse talent', roles: ['HR Manager'], industries: ['Manufacturing'], departments: ['HR'], difficulty: 'beginner', estimated_time: '10 min', tags: ['HR', 'Recruiting'], content: { prompt: 'Write JD for [role]: summary, 8-10 responsibilities, required/nice skills, benefits, growth, compensation range.', tips: 'Remove gendered language. Be specific about skills.' } },
  { type: 'prompt', title: 'Plan Compensation Strategy', description: 'Benchmark and set pay levels', roles: ['HR Manager'], industries: ['Manufacturing'], departments: ['HR'], difficulty: 'intermediate', estimated_time: '20 min', tags: ['HR', 'Compensation'], content: { prompt: 'Create compensation strategy for [role/region]: market research, pay bands, bonuses, benefits, equity.', tips: 'Use 25th, 50th, 75th percentile data.' } },

  // DESIGNER + TECH - PROMPTS
  { type: 'prompt', title: 'Generate Design System Tokens', description: 'Extract tokens from Figma', roles: ['Designer'], industries: ['Tech'], departments: ['Design'], difficulty: 'beginner', estimated_time: '8 min', tags: ['Design', 'Tokens'], content: { prompt: 'Export Figma colors, typography, spacing, shadows. Generate: CSS vars, Tailwind config, iOS/Android tokens, JSON.', tips: 'Include contrast ratios. Add dark mode variants.' } },

  // CEO + TECH - PROMPTS
  { type: 'prompt', title: 'Analyze Competitor Strategy', description: 'Extract insights from public data', roles: ['CEO'], industries: ['Tech'], departments: ['Product'], difficulty: 'advanced', estimated_time: '20 min', tags: ['Strategy', 'Competition'], content: { prompt: 'Analyze 5 competitors: positioning, features, segments, pricing, messaging. Identify: gaps, threats, opportunities.', tips: 'Use only public data (SEC filings, changelogs, reviews).' } },

  // MULTI-ROLE TUTORIALS
  { type: 'tutorial', title: 'Getting Started with AI Prompts', description: 'Foundations of prompt engineering', roles: ['Data Analyst', 'Manager', 'Engineer', 'Designer', 'Marketer', 'CEO', 'Sales Rep', 'HR Manager', 'Product Manager'], industries: ['Finance', 'Tech', 'Retail', 'Healthcare', 'Manufacturing', 'Education', 'Government', 'Media'], departments: ['Analytics', 'Operations', 'Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'HR'], difficulty: 'beginner', estimated_time: '15 min', tags: ['Fundamentals'], content: { steps: [ { title: 'Basics', content: 'AI works best with: context, role, task, constraints, output format.' }, { title: 'Examples', content: 'Show good output. One example > 100 instructions.' }, { title: 'Structure', content: 'Use JSON, bullets, tables. Specify tone.' }, { title: 'Iterate', content: 'Refine: "More concise", "Add examples", "Different angle".' }, { title: 'Test', content: 'Save good prompts. Test variations. Measure results.' } ] } },
  { type: 'tutorial', title: 'Prompt Engineering Best Practices', description: 'Advanced techniques', roles: ['Engineer', 'Data Analyst', 'Product Manager'], industries: ['Tech', 'Finance', 'Healthcare'], departments: ['Engineering', 'Analytics', 'Product'], difficulty: 'intermediate', estimated_time: '20 min', tags: ['Advanced'], content: { steps: [ { title: 'Chain of thought', content: 'Ask: "think step by step". Improves reasoning.' }, { title: 'Role-play', content: 'Assume role: "You are a senior architect."' }, { title: 'Constraints', content: 'Use format: "Max 5 bullets", "Code only"' }, { title: 'Uncertainty', content: 'Ask: "What assumptions are you making?"' }, { title: 'Few-shot', content: 'Show 2-3 input→output examples.' } ] } },

  // CASE STUDIES
  { type: 'caseStudy', title: 'Netflix Personalization', description: 'AI recommendation engine', roles: ['Data Analyst', 'Product Manager', 'Manager'], industries: ['Media', 'Tech'], departments: ['Analytics', 'Product', 'Operations'], difficulty: 'intermediate', estimated_time: '12 min', tags: ['Personalization', 'ML'], content: { challenge: 'Recommend to 250M+ users with varying tastes', solution: 'Multi-model: collaborative, content-based, ML on history', results: 'Drives 80% of viewing; saves $1B+ on content strategy', keyTakeaway: 'Ensemble methods required. No single model best for all.' } },
  { type: 'caseStudy', title: 'Amazon Supply Chain', description: 'AI-driven logistics optimization', roles: ['Manager', 'Data Analyst'], industries: ['Retail'], departments: ['Operations', 'Analytics'], difficulty: 'advanced', estimated_time: '15 min', tags: ['Operations', 'ML'], content: { challenge: 'Optimize 150+ fulfillment centers for 100M+ customers globally', solution: 'Demand forecasting (Prophet/LSTM), dynamic routing, pre-positioning', results: '2-day delivery standard; 30% less excess inventory', keyTakeaway: 'Predictive models only useful if operationalized. Model + systems + people.' } },
  { type: 'caseStudy', title: 'JPMorgan Fraud Detection', description: 'ML for financial risk', roles: ['Data Analyst'], industries: ['Finance'], departments: ['Analytics'], difficulty: 'beginner', estimated_time: '10 min', tags: ['Risk', 'ML'], content: { challenge: 'Detect fraud in millions of daily transactions with high accuracy', solution: 'Anomaly detection: transaction patterns, rule-based + ML hybrid', results: '40% fraud reduction, 60% fewer false positives', keyTakeaway: 'Combine rules with ML. Domain expertise + AI > either alone.' } },
  { type: 'caseStudy', title: 'Uber Dynamic Pricing', description: 'Surge pricing algorithm', roles: ['Manager', 'Data Analyst', 'Product Manager'], industries: ['Retail', 'Tech'], departments: ['Operations', 'Analytics', 'Product'], difficulty: 'intermediate', estimated_time: '12 min', tags: ['Pricing', 'ML'], content: { challenge: 'Balance supply/demand across 70+ cities', solution: 'Real-time demand prediction, driver modeling, competitor pricing, elasticity', results: '3-5x driver earnings, 40% less wait time', keyTakeaway: 'Algorithmic pricing needs guardrails. Too high = backlash. Too low = churn.' } },
  { type: 'caseStudy', title: 'Goldman Sachs Algo Trading', description: 'ML in high-frequency trading', roles: ['Data Analyst', 'Engineer'], industries: ['Finance'], departments: ['Analytics', 'Engineering'], difficulty: 'advanced', estimated_time: '18 min', tags: ['Finance', 'ML'], content: { challenge: 'Predict movements with 100ms latency, trade profitably at scale', solution: 'ML on tick-by-tick data, real-time feature engineering, risk controls, ensemble', results: '30-50% annual returns; powers billions daily', keyTakeaway: 'Speed matters. Interpretation + risk management > accuracy.' } }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding comprehensive content library...');

    await query('DELETE FROM content');
    console.log('✓ Cleared existing content');

    let inserted = 0;
    for (const item of contentLibrary) {
      await query(
        `INSERT INTO content (type, title, description, roles, industries, difficulty, estimated_time, content, tags, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
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
    }

    console.log(`\n✅ Successfully seeded ${inserted} content items!`);
    console.log(`📊 Breakdown:`);
    console.log(`  - Prompts: ${contentLibrary.filter(c => c.type === 'prompt').length}`);
    console.log(`  - Tutorials: ${contentLibrary.filter(c => c.type === 'tutorial').length}`);
    console.log(`  - Case Studies: ${contentLibrary.filter(c => c.type === 'caseStudy').length}`);

    const result = await query('SELECT COUNT(*) as count FROM content');
    console.log(`\n✓ Verification: ${result.rows[0].count} total items in database`);

  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
