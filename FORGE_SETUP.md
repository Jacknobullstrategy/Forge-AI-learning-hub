# 🐂 Forge AI Coach Setup Guide

Forge is your interactive AI learning buddy powered by Claude. Set him up in minutes!

## Quick Setup

### 1. Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/account/keys)
2. Sign in or create account (free tier available)
3. Create a new API key
4. Copy the key

### 2. Add API Key to .env

Open `.env` and add your key:

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 3. Restart the Server

```bash
# Kill the running server (if any)
npm run server
```

### 4. Start Using Forge!

- Open the app in browser
- Click the **🐂 Forge button** in bottom right
- Start chatting!

## Features

### 💬 Chat & Coaching
- Ask Forge questions about AI concepts
- Get personalized learning recommendations
- Get help understanding content
- Ask for prompts and tips

### 🎯 AI Tutor
Forge automatically:
- Recommends content based on your role/industry
- Suggests next steps in your learning journey
- Provides encouragement and feedback
- Explains concepts in simple terms

### 📚 Learning Paths
- Create personalized learning plans
- Get weekly milestones and goals
- Track your progress
- Adjust difficulty on the fly

### 🎤 Voice Features
- Forge speaks responses (text-to-speech)
- Hear explanations while reading
- Immersive learning experience

### 🎨 Animated Personality
Forge's expressions:
- 😊 **Happy** - Default, encouraging mode
- 🤔 **Thinking** - Processing your request
- 🎉 **Excited** - Celebrating your wins
- 💪 **Encouraging** - Supporting you through challenges

## Quick Actions

Click quick-action buttons in Forge's panel:

1. **Recommend Content** - "What should I learn next?"
2. **Explain Concept** - Get explanations of hard topics
3. **Study Plan** - Create personalized learning plan
4. **Challenge Me** - Get advanced prompts to work on

## Example Conversations

### Ask for Help with a Concept
```
You: "What is retrieval-augmented generation?"
Forge: "Great question! RAG is like giving ChatGPT access to 
your personal library. Instead of relying only on training data, 
RAG lets the AI retrieve relevant documents and use them to 
give more accurate, up-to-date answers. Think of it like a 
student using their textbook during an exam instead of relying 
only on memory!"
```

### Get Personalized Recommendations
```
You: "I'm a Data Analyst in Tech. What should I focus on?"
Forge: "Perfect! Based on your profile, I recommend:
1. Master SQL optimization (15 min) - Essential for large datasets
2. Learn cohort analysis (18 min) - Critical for retention metrics
3. Explore A/B testing (20 min) - Key skill for product teams

Let's start with SQL optimization since it unlocks performance 
improvements for everything else."
```

### Create a Learning Plan
```
You: "I want to become better at using AI for my job in 2 weeks"
Forge: "Awesome goal! Here's your 2-week plan:

Week 1: Foundations
- Day 1-2: Getting started with AI (6 min tutorial)
- Day 3-4: Learn effective prompting (15 min course)
- Day 5-7: Practice with real work tasks

Week 2: Advanced Skills
- Day 8-9: Build specialized prompts for your role
- Day 10-11: Learn about AI limitations and ethics
- Day 12-14: Master advanced techniques

Let's start with the foundations tutorial!"
```

## Features Coming Soon

- 🎓 Learning certificates & achievements
- 📊 Progress dashboards
- 👥 Community learning groups
- 🏆 Leaderboards & gamification
- 📱 Mobile app
- 🌍 Multi-language support
- 🎙️ Full voice interaction
- 🤖 Integration with other AI tools

## Troubleshooting

### Forge isn't responding
1. Check `.env` has valid `ANTHROPIC_API_KEY`
2. Make sure server is running (`npm run server`)
3. Check browser console for errors (F12)
4. Restart the server

### API Key errors
- Verify key format: should start with `sk-ant-`
- Check key isn't expired in Anthropic console
- Make sure you copied the entire key
- Try generating a new key

### Voice not working
- Check browser permissions for audio
- Try in a different browser
- Some browsers require user interaction first (click button)
- Mobile browsers may not support text-to-speech

### Slow responses
- First response may be slower (model loading)
- Check internet connection
- Anthropic API rate limits? Try again in a few seconds
- Forge only works with active internet connection

## Tips for Best Results

### Give Forge Context
Instead of: "Explain machine learning"
Try: "As a Data Analyst in Tech, how do I use machine learning to predict user churn?"

### Be Specific About Your Goal
Instead of: "What should I learn?"
Try: "I need to create my first SQL query for analyzing customer retention"

### Use Quick Actions First
Click the quick-action buttons to see examples of what Forge can do

### Build on Conversations
Forge remembers your conversation. Say things like:
- "Can you elaborate on that?"
- "Give me a simpler explanation"
- "Show me an example"

### Ask for Challenges
Once comfortable with basics:
- "Give me a hard prompt to work on"
- "Challenge me with an advanced concept"
- "Create a real-world scenario for me to solve"

## Privacy & Security

- ✅ Your chats are encrypted in transit
- ✅ Anthropic doesn't use your data to train models
- ✅ Your API key is kept secure on your server
- ✅ See [Anthropic Privacy Policy](https://www.anthropic.com/privacy)

## Support

Having issues? 

1. Check this guide first
2. Check `.env` configuration
3. Restart the server
4. Check browser console (F12) for errors
5. Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Your role/industry (helps Forge help you!)

## Cost

Anthropic's Claude 3.5 Sonnet pricing (as of 2024):
- **Input tokens**: $3 per million tokens
- **Output tokens**: $15 per million tokens

For typical usage (10-15 min conversations daily):
- Estimated cost: ~$5-10 per month
- Free tier available for testing
- Academic/research discounts available

## Have Fun! 🎉

Forge is designed to be helpful, encouraging, and fun. Don't hesitate to:
- Ask "dumb" questions (there aren't any!)
- Request explanations multiple ways
- Challenge yourself with advanced prompts
- Share what you learned with teammates

Happy learning! 🚀

---

**Questions?** Ask Forge directly in the chat! He loves helping with learning.
