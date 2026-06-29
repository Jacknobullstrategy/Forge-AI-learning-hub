// Seed data for AI Learning Hub

export const roles = [
  "Data Analyst",
  "Manager",
  "Engineer",
  "Designer",
  "Marketer",
  "CEO",
  "Sales Rep",
  "HR Manager",
  "Product Manager",
];

export const industries = [
  "Finance",
  "Tech",
  "Healthcare",
  "Retail",
  "Education",
  "Manufacturing",
  "Media",
  "Government",
];

export const departments = [
  "Analytics",
  "Operations",
  "Marketing",
  "Sales",
  "HR",
  "Engineering",
  "Design",
  "Product",
];

export const contentLibrary = [
  // Data Analyst Prompts
  {
    id: "prompt_001",
    type: "prompt",
    title: "Analyze customer churn",
    description: "Write SQL queries to identify churn patterns",
    roles: ["Data Analyst", "Manager"],
    industries: ["Finance", "Tech", "Retail"],
    departments: ["Analytics"],
    tags: ["SQL", "Analytics", "Customer"],
    difficulty: "intermediate",
    estimatedTime: "5 min",
    prompt: `Write a SQL query that identifies customer churn patterns. Include:
- Customer segmentation by tenure
- Churn rate by segment
- Key characteristics of churned vs retained customers
- Time-based trends`,
    tips: "Combine with window functions to track trends over time. Use cohort analysis for better insights.",
    relatedContent: ["tutorial_001", "case_study_001"],
  },
  {
    id: "prompt_002",
    type: "prompt",
    title: "Generate revenue forecasting model",
    description: "Create Python code for revenue prediction",
    roles: ["Data Analyst", "Engineer"],
    industries: ["Finance", "Tech"],
    departments: ["Analytics"],
    tags: ["Python", "Forecasting", "Revenue"],
    difficulty: "advanced",
    estimatedTime: "10 min",
    prompt: `Write Python code using scikit-learn or similar to forecast revenue:
- Incorporate historical sales data
- Account for seasonality
- Include confidence intervals
- Provide model performance metrics`,
    tips: "Try SARIMA or Prophet for time-series forecasting. Validate on holdout data.",
    relatedContent: ["tutorial_002"],
  },
  {
    id: "prompt_003",
    type: "prompt",
    title: "Automate report generation",
    description: "Build AI-powered insights from raw data",
    roles: ["Data Analyst", "Manager"],
    industries: ["All"],
    departments: ["Analytics", "Operations"],
    tags: ["Automation", "Reporting"],
    difficulty: "beginner",
    estimatedTime: "3 min",
    prompt: `Use AI to analyze dataset and generate:
- Key findings summary
- Anomalies and trends
- Recommended actions
- Executive summary in bullet points`,
    tips: "Feed structured data (CSV/JSON) to Claude for natural language summaries.",
    relatedContent: ["tutorial_003", "case_study_002"],
  },

  // Manager Prompts
  {
    id: "prompt_004",
    type: "prompt",
    title: "Prepare team meeting agenda with AI",
    description: "Automatically generate meeting agendas and talking points",
    roles: ["Manager", "CEO"],
    industries: ["All"],
    departments: ["Operations", "HR"],
    tags: ["Meetings", "Management"],
    difficulty: "beginner",
    estimatedTime: "2 min",
    prompt: `Create a team meeting agenda:
- List of topics to cover
- Time allocation per topic
- Discussion questions
- Action items template
- Suggested talking points based on team goals`,
    tips: "Paste last meeting notes or team metrics for context.",
    relatedContent: [],
  },
  {
    id: "prompt_005",
    type: "prompt",
    title: "Write performance review feedback",
    description: "Generate balanced, constructive feedback",
    roles: ["Manager", "HR Manager"],
    industries: ["All"],
    departments: ["HR", "Operations"],
    tags: ["HR", "Management"],
    difficulty: "beginner",
    estimatedTime: "5 min",
    prompt: `Draft performance review feedback:
- Strengths highlighted with examples
- Growth areas with development suggestions
- SMART goals for next period
- Encouraging tone that motivates improvement`,
    tips: "Include specific examples and actionable development paths.",
    relatedContent: ["tutorial_004"],
  },

  // Engineer Prompts
  {
    id: "prompt_006",
    type: "prompt",
    title: "Debug code with AI assistance",
    description: "Use AI to identify and fix bugs",
    roles: ["Engineer"],
    industries: ["Tech"],
    departments: ["Engineering"],
    tags: ["Debugging", "Code"],
    difficulty: "intermediate",
    estimatedTime: "5 min",
    prompt: `Debug this code:
[paste code here]

Please:
1. Identify the bug
2. Explain what's causing it
3. Provide the fix with explanation
4. Suggest ways to prevent similar bugs`,
    tips: "Include error messages and expected vs actual behavior.",
    relatedContent: ["tutorial_005"],
  },
  {
    id: "prompt_007",
    type: "prompt",
    title: "Generate API documentation",
    description: "Auto-create API specs from code",
    roles: ["Engineer", "Product Manager"],
    industries: ["Tech"],
    departments: ["Engineering", "Product"],
    tags: ["Documentation", "API"],
    difficulty: "intermediate",
    estimatedTime: "5 min",
    prompt: `Create OpenAPI/Swagger documentation for:
[describe endpoints or paste code]

Include:
- Request/response schemas
- Error codes and handling
- Authentication requirements
- Rate limiting details
- Example calls`,
    tips: "Be specific about request parameters and response formats.",
    relatedContent: [],
  },

  // Marketer Prompts
  {
    id: "prompt_008",
    type: "prompt",
    title: "Create marketing campaign copy",
    description: "Generate compelling campaign messaging",
    roles: ["Marketer"],
    industries: ["All"],
    departments: ["Marketing"],
    tags: ["Marketing", "Copy"],
    difficulty: "beginner",
    estimatedTime: "5 min",
    prompt: `Write marketing copy for [product/service]:
- Compelling headline
- Benefits-focused body (3-4 sentences)
- Clear call-to-action
- A/B test alternatives
- Social media variations`,
    tips: "Provide target audience and key differentiators for better copy.",
    relatedContent: ["case_study_003"],
  },
  {
    id: "prompt_009",
    type: "prompt",
    title: "Analyze competitor strategy",
    description: "Research and summarize competitor approach",
    roles: ["Marketer", "Product Manager"],
    industries: ["All"],
    departments: ["Marketing", "Product"],
    tags: ["Competitive", "Strategy"],
    difficulty: "intermediate",
    estimatedTime: "5 min",
    prompt: `Analyze competitor [name]:
- Positioning and messaging
- Target market
- Key features/differentiators
- Pricing strategy
- Marketing channels
- Strengths and weaknesses
- Opportunities for differentiation`,
    tips: "Gather from website, recent news, and user reviews.",
    relatedContent: [],
  },

  // Tutorials
  {
    id: "tutorial_001",
    type: "tutorial",
    title: "Getting started with AI for data analysis",
    roles: ["Data Analyst"],
    estimatedTime: "15 min",
    steps: [
      {
        title: "Define your question",
        content:
          'Start with a clear business question. "What factors influence churn?" is better than "analyze data".',
      },
      {
        title: "Gather your data",
        content:
          "Prepare data sources. Use AI to generate schemas and sample queries to explore the data.",
      },
      {
        title: "Ask AI to help",
        content:
          "Describe your task to Claude. Use prompts from the library as starting points. Include sample data or schema.",
      },
      {
        title: "Iterate and refine",
        content:
          "Ask follow-up questions to improve results. Save successful prompts for future use.",
      },
    ],
  },
  {
    id: "tutorial_002",
    type: "tutorial",
    title: "AI-powered forecasting basics",
    roles: ["Data Analyst", "Manager"],
    estimatedTime: "20 min",
    steps: [
      {
        title: "Choose your data",
        content: "Select time-series data with at least 2 years of history for reliable forecasts.",
      },
      {
        title: "Understand seasonality",
        content: "Identify seasonal patterns (monthly, quarterly, yearly) in your data.",
      },
      {
        title: "Build the model",
        content: "Use AI to write forecasting code. Prophet and SARIMA are popular choices.",
      },
      {
        title: "Validate and present",
        content: "Test on holdout data. Present with confidence intervals and caveats.",
      },
    ],
  },
  {
    id: "tutorial_003",
    type: "tutorial",
    title: "Automating reports with AI",
    roles: ["Data Analyst", "Manager"],
    estimatedTime: "12 min",
    steps: [
      {
        title: "Export your data",
        content: "Get data as CSV or JSON. Include context about what each metric means.",
      },
      {
        title: "Feed to AI",
        content: "Use Claude to analyze and generate insights from your data.",
      },
      {
        title: "Request a summary",
        content: "Ask for a business-friendly summary with key findings and recommendations.",
      },
      {
        title: "Schedule it",
        content: "Set up a workflow to run this weekly or monthly automatically.",
      },
    ],
  },
  {
    id: "tutorial_004",
    type: "tutorial",
    title: "Writing better feedback with AI",
    roles: ["Manager", "HR Manager"],
    estimatedTime: "10 min",
    steps: [
      {
        title: "Gather observations",
        content: "Note specific examples of strengths and areas for growth throughout the review period.",
      },
      {
        title: "Use AI as a draft tool",
        content:
          "Provide examples to Claude and ask it to draft balanced, constructive feedback.",
      },
      {
        title: "Personalize the output",
        content: "Edit AI-generated feedback to add your voice and specific examples.",
      },
      {
        title: "Add development plan",
        content: "Conclude with clear goals and support for the next period.",
      },
    ],
  },
  {
    id: "tutorial_005",
    type: "tutorial",
    title: "Debugging code with AI",
    roles: ["Engineer"],
    estimatedTime: "10 min",
    steps: [
      {
        title: "Prepare your code",
        content:
          "Paste the buggy code and any error messages. Describe expected vs actual behavior.",
      },
      {
        title: "Ask for analysis",
        content:
          "Ask Claude to identify the root cause. Include relevant context (language, libraries, etc.).",
      },
      {
        title: "Request the fix",
        content:
          "Ask for the corrected code with explanation of what changed and why.",
      },
      {
        title: "Learn for next time",
        content:
          "Ask how to prevent similar bugs. Update your code review checklist.",
      },
    ],
  },

  // Case Studies
  {
    id: "case_study_001",
    type: "caseStudy",
    title: "How Spotify reduced churn by 30%",
    roles: ["Data Analyst", "Manager"],
    industries: ["Tech", "Media"],
    challenge:
      "Spotify was losing 15% of subscribers annually and needed to identify why and who was at risk.",
    solution:
      "They used AI to analyze user behavior patterns and identify early churn signals. Built predictive models to flag at-risk users and personalized retention campaigns using AI-generated recommendations.",
    results: "30% reduction in churn within 6 months. Saved millions in subscriber lifetime value.",
    keyTakeaway:
      "Combining predictive analytics with AI-personalized outreach dramatically improves retention.",
  },
  {
    id: "case_study_002",
    type: "caseStudy",
    title: "Automating quarterly reporting at Salesforce",
    roles: ["Data Analyst", "Manager"],
    industries: ["Tech"],
    challenge:
      "Finance team spent 40 hours per quarter manually compiling reports from 10+ data sources.",
    solution:
      "Implemented AI-powered workflow that auto-queries databases, compiles data, and generates insights. Finance team now reviews and approves AI-generated summaries.",
    results: "Reduced reporting time from 40 hours to 4 hours. Improved accuracy and consistency.",
    keyTakeaway:
      "AI can handle data wrangling and summarization; humans focus on strategic interpretation.",
  },
  {
    id: "case_study_003",
    type: "caseStudy",
    title: "Scaling marketing copy with AI at HubSpot",
    roles: ["Marketer"],
    industries: ["Tech"],
    challenge: "Marketing team needed to create 50+ campaign variations quickly for A/B testing.",
    solution:
      "Used AI to generate multiple copy variations based on target audience and positioning. Team edited top performers and tested them.",
    results: "30% faster campaign creation. 15% higher click-through rates on AI-assisted copy.",
    keyTakeaway:
      "AI generates options quickly; humans judge quality and refine for brand voice.",
  },
];
