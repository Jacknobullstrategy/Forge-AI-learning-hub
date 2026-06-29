import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Anthropic client
let anthropic = null;
try {
  const AnthropicModule = await import('@anthropic-ai/sdk');
  anthropic = new AnthropicModule.default({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
} catch (err) {
  console.warn('Anthropic SDK not installed. Run: npm install @anthropic-ai/sdk');
}

// System prompt for Forge
const FORGE_SYSTEM_PROMPT = `You are Forge, an enthusiastic and knowledgeable AI learning coach with a bull mascot personality. You're helping users learn about AI and how to leverage it for their specific roles and industries.

Your personality:
- Enthusiastic and encouraging (use emojis sparingly but effectively)
- Knowledgeable about AI applications across different industries
- Patient and clear in explanations
- Personalized in recommendations
- Action-oriented (guide users to specific content or actions)

Your responsibilities:
1. **Content Recommendations**: Based on user's role/industry/goals, suggest relevant prompts, tutorials, and case studies
2. **Coaching**: Help users understand concepts, provide tips, and guide them through challenges
3. **Learning Paths**: Create personalized learning plans tailored to their goals
4. **Motivation**: Celebrate wins, encourage when stuck, challenge when ready
5. **Q&A**: Answer questions about AI, the content, and how to use prompts effectively

When recommending content, be specific about why it's relevant to their goals.
When explaining concepts, use analogies and real-world examples.
When suggesting challenges, scale based on their current level.

Format your responses clearly with:
- Direct answer to their question/request
- Specific next steps or recommendations
- Encouragement to keep learning`;

// POST /api/forge/chat - Chat with Forge
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(503).json({
        error: 'Forge AI coach is not available. Please set ANTHROPIC_API_KEY environment variable.'
      });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages for Claude
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role === 'forge' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: FORGE_SYSTEM_PROMPT,
      messages: messages
    });

    // Extract response text
    const forgeResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I had trouble understanding that. Can you rephrase?';

    res.json({
      success: true,
      response: forgeResponse
    });

  } catch (error) {
    console.error('Forge chat error:', error);
    res.status(500).json({
      error: 'Failed to get Forge response',
      message: error.message
    });
  }
});

// POST /api/forge/recommendation - Get personalized learning recommendation
router.post('/recommendation', authenticateToken, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(503).json({ error: 'Forge AI coach is not available' });
    }

    const { userProfile, currentProgress } = req.body;

    const prompt = `Based on this user profile and progress, recommend the next best content to learn:

User Profile:
- Role: ${userProfile.role}
- Industry: ${userProfile.industry}
- Department: ${userProfile.department}

Current Progress:
- Viewed: ${currentProgress.viewedCount || 0} items
- Saved: ${currentProgress.savedCount || 0} items
- Recently viewed: ${currentProgress.lastViewed || 'None yet'}

Provide a brief, personalized recommendation with:
1. What they should learn next (topic)
2. Why it's important for their role
3. Difficulty level suggestion
4. Expected time commitment`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      system: FORGE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });

    const recommendation = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I recommend exploring tutorials to build your foundational knowledge.';

    res.json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      message: error.message
    });
  }
});

// POST /api/forge/learning-plan - Create personalized learning plan
router.post('/learning-plan', authenticateToken, async (req, res) => {
  try {
    if (!anthropic) {
      return res.status(503).json({ error: 'Forge AI coach is not available' });
    }

    const { goal, timeframe, currentLevel } = req.body;

    const prompt = `Create a personalized learning plan for:

Goal: ${goal}
Available time: ${timeframe} (e.g., "30 min/day for 2 weeks")
Current level: ${currentLevel} (beginner/intermediate/advanced)

Provide a structured weekly plan with:
1. Week-by-week milestones
2. Specific topics to focus on
3. Recommended difficulty progression
4. Checkpoints and success criteria
5. Tips for staying motivated`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: FORGE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    });

    const plan = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Here\'s a suggested learning path for you...';

    res.json({
      success: true,
      plan
    });

  } catch (error) {
    console.error('Learning plan error:', error);
    res.status(500).json({
      error: 'Failed to create learning plan',
      message: error.message
    });
  }
});

export default router;
