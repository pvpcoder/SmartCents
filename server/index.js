require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// CORS configuration for local development
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5550",
    "http://127.0.0.1:5550",
    "http://localhost:5555",
    "http://127.0.0.1:5555",
    "file://"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SmartCents Local Server is running',
    mode: 'local-storage',
    timestamp: new Date().toISOString()
  });
});

// AI Mentor Tip - OpenAI implementation
app.post('/api/mentor-tip', async (req, res) => {
  try {
    const { transactions = [], goals = [], score = 0 } = req.body;
    
    // Prepare context for OpenAI
    let context = `You are a helpful financial mentor for SmartCents. `;
    
    if (transactions.length > 0 || goals.length > 0) {
      context += `The user has financial data: `;
      if (transactions.length > 0) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const totalSavings = totalIncome - totalExpenses;
        context += `Income: $${totalIncome.toFixed(2)}, Expenses: $${totalExpenses.toFixed(2)}, Savings: $${totalSavings.toFixed(2)}. `;
      }
      if (goals.length > 0) {
        context += `They have ${goals.length} savings goal(s). `;
      }
      if (score > 0) {
        context += `Their financial independence score is ${score}/100. `;
      }
    }

    context += `Provide one personalized financial tip based on their data. Be encouraging and specific. Keep it under 100 words.`;

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "user", content: "Give me a personalized financial tip based on my data." }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const tip = completion.choices[0].message.content;
    
    res.json({ 
      success: true, 
      tip,
      source: 'openai-gpt',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    
    // Fallback to local response if OpenAI fails
    try {
      const tip = generateLocalMentorTip(transactions, goals, score);
      res.json({ 
        success: true, 
        tip,
        source: 'local-fallback',
        timestamp: new Date().toISOString()
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Failed to generate mentor tip',
        fallback: "Start tracking your income and expenses to get personalized financial advice."
      });
    }
  }
});

// Chatbot - OpenAI implementation
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message = '', transactions = [], goals = [], score = 0 } = req.body;
    
    if (!message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Prepare context for OpenAI
    let context = `You are a helpful financial mentor for SmartCents, a financial literacy app for young people. `;
    
    if (transactions.length > 0 || goals.length > 0) {
      context += `The user has financial data: `;
      if (transactions.length > 0) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const totalSavings = totalIncome - totalExpenses;
        context += `Income: $${totalIncome.toFixed(2)}, Expenses: $${totalExpenses.toFixed(2)}, Savings: $${totalSavings.toFixed(2)}. `;
      }
      if (goals.length > 0) {
        context += `They have ${goals.length} savings goal(s). `;
      }
      if (score > 0) {
        context += `Their financial independence score is ${score}/100. `;
      }
    }

    context += `Provide helpful, encouraging financial advice. Be conversational and use emojis occasionally. Keep responses under 200 words.`;

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    
    res.json({ 
      success: true, 
      reply,
      source: 'openai-gpt',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    
    // Fallback to local response if OpenAI fails
    try {
      const reply = generateLocalChatbotResponse(message, transactions, goals, score);
      res.json({ 
        success: true, 
        reply,
        source: 'local-fallback',
        timestamp: new Date().toISOString()
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: "Failed to generate response",
        fallback: "I'm having trouble connecting to my AI brain right now. Try asking me about your savings, spending, or goals!"
      });
    }
  }
});

// Generate local mentor tip
function generateLocalMentorTip(transactions, goals, score = 0) {
  if (!transactions || transactions.length === 0) {
    return "Start tracking your income and expenses to get personalized financial advice. Every transaction you log helps me understand your spending patterns and provide better guidance!";
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100) : 0;

  // Analyze spending categories
  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, '');

  // Generate personalized tip
  let tip = "";
  
  if (savingsRate >= 20) {
    tip = `🎉 Excellent work! You're saving ${savingsRate.toFixed(1)}% of your income, which is above the recommended 20%. `;
    if (goals.length > 0) {
      tip += `Keep focusing on your goals - you're building great financial habits!`;
    } else {
      tip += `Consider setting some savings goals to make your money work even harder for you.`;
    }
  } else if (savingsRate >= 10) {
    tip = `👍 Good progress! You're saving ${savingsRate.toFixed(1)}% of your income. `;
    tip += `Try to increase this to 20% by looking for ways to reduce expenses or increase income.`;
  } else if (savingsRate >= 0) {
    tip = `📊 You're saving ${savingsRate.toFixed(1)}% of your income. `;
    tip += `Aim for 20% savings rate by tracking every expense and finding areas to cut back.`;
  } else {
    tip = `⚠️ You're currently spending more than you earn. `;
    tip += `Focus on reducing expenses, especially in your top spending category: ${topCategory}.`;
  }

  // Add category-specific advice
  if (topCategory && categoryTotals[topCategory] > totalIncome * 0.4) {
    tip += ` Your ${topCategory} spending is quite high - consider setting a budget for this category.`;
  }

  // Add goal-related advice
  if (goals.length > 0) {
    const activeGoals = goals.filter(g => (g.savedAmount || 0) < g.targetAmount);
    if (activeGoals.length > 0) {
      tip += ` You have ${activeGoals.length} active savings goal(s). Stay focused on these to build your financial future!`;
    }
  }

  // Add independence score context
  if (score > 0) {
    if (score >= 80) {
      tip += ` 🎯 Your independence score is ${score}/100 - you're a financial superstar! Keep up these excellent habits.`;
    } else if (score >= 60) {
      tip += ` 🎯 Your independence score is ${score}/100 - you're doing great! Focus on the areas above to reach 80+.`;
    } else if (score >= 40) {
      tip += ` 🎯 Your independence score is ${score}/100 - good foundation! Implement the advice above to boost your score.`;
    } else {
      tip += ` 🎯 Your independence score is ${score}/100 - let's build this up! Follow the advice above to improve your financial habits.`;
    }
  }

  return tip;
}

// Generate local chatbot response
function generateLocalChatbotResponse(message, transactions, goals, score) {
  const lowerMessage = message.toLowerCase();
  
  // Financial analysis
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100) : 0;

  // Add some randomness and variety to responses
  const randomEmojis = ['🎯', '💡', '🚀', '⭐', '🔥', '💪', '🎉', '📈', '💰', '🛡️'];
  const randomEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];

  // Common questions and responses with more variety
  if (lowerMessage.includes('savings') || lowerMessage.includes('save')) {
    if (savingsRate >= 20) {
      const responses = [
        `🎉 Fantastic! You're crushing it with a ${savingsRate.toFixed(1)}% savings rate - well above the 20% goal! You're building serious wealth momentum.`,
        `🚀 Wow! ${savingsRate.toFixed(1)}% savings rate puts you in the financial elite! Keep this up and you'll be unstoppable.`,
        `⭐ You're a savings superstar! ${savingsRate.toFixed(1)}% is exceptional - you're setting yourself up for an amazing financial future.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (savingsRate >= 10) {
      const responses = [
        `👍 Solid progress! ${savingsRate.toFixed(1)}% savings is a good foundation. Push for 20% by cutting one non-essential expense this month.`,
        `💡 You're on the right track with ${savingsRate.toFixed(1)}%! Try the "save first" method - transfer savings before spending anything else.`,
        `📊 Good work! ${savingsRate.toFixed(1)}% savings shows discipline. Challenge yourself to save an extra 5% this month.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      const responses = [
        `📊 ${savingsRate.toFixed(1)}% savings is a start! Try the envelope method - divide cash into categories and stick to limits.`,
        `💪 Every journey begins with a single step! ${savingsRate.toFixed(1)}% is your starting point. Aim to double it next month.`,
        `🛡️ Building savings takes time. At ${savingsRate.toFixed(1)}%, focus on one spending category to reduce this week.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  if (lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
    if (transactions.length === 0) {
      const responses = [
        "🚀 Ready to take control? Start by tracking your first expense! Knowledge is power when it comes to money.",
        "💡 The journey to financial freedom begins with awareness. Log your first expense and watch your understanding grow!",
        "📊 No expenses logged yet? That's your starting point! Every great financial journey begins with the first step."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, '');
    
    const responses = [
      `🎯 Your biggest spending area is ${topCategory} ($${categoryTotals[topCategory].toFixed(2)}). Try the 30-day rule: wait 30 days before big purchases in this category.`,
      `💡 ${topCategory} is eating up $${categoryTotals[topCategory].toFixed(2)} of your budget. Consider setting a monthly limit and tracking it weekly.`,
      `📊 ${topCategory} dominates your spending at $${categoryTotals[topCategory].toFixed(2)}. Challenge yourself to reduce this by 20% next month!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
    if (goals.length === 0) {
      return "Set your first savings goal! Whether it's a new phone, college fund, or emergency savings, having a target helps you stay motivated.";
    }
    
    const activeGoals = goals.filter(g => (g.savedAmount || 0) < g.targetAmount);
    const completedGoals = goals.filter(g => (g.savedAmount || 0) >= g.targetAmount);
    
    return `You have ${activeGoals.length} active goal(s) and ${completedGoals.length} completed goal(s)! Keep working on your active goals - every dollar saved gets you closer to your dreams.`;
  }

  if (lowerMessage.includes('score') || lowerMessage.includes('independence')) {
    return `Your current independence score is ${score}/100. This score reflects your financial habits - tracking expenses, saving money, and working toward goals all help increase it!`;
  }

  if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
    if (totalIncome === 0) {
      return "Start by logging your first income! Whether it's allowance, part-time work, or gifts, tracking income helps you understand your earning potential.";
    }
    return `You've earned $${totalIncome.toFixed(2)} total. Great job tracking your income! Consider ways to increase this through part-time work, skills development, or finding new opportunities.`;
  }

  if (lowerMessage.includes('advice') || lowerMessage.includes('help') || lowerMessage.includes('tip')) {
    return generateLocalMentorTip(transactions, goals, score);
  }

  // Generic finance education questions with more personality
  if (lowerMessage.includes('budget') || lowerMessage.includes('budgeting')) {
    const responses = [
      `📊 **Budgeting** is like having a GPS for your money! It's creating a roadmap that shows where your income goes and ensures you're saving for your dreams. The 50/30/20 rule is your compass: 50% for needs (food, housing), 30% for wants (entertainment), and 20% for savings. Think of it as giving every dollar a job!`,
      `🎯 **Budgeting** is your financial game plan! It's not about restriction - it's about making your money work smarter for you. The 50/30/20 rule is your playbook: 50% for essentials, 30% for fun stuff, and 20% for building wealth. It's like having a personal financial coach!`,
      `💡 **Budgeting** is the secret weapon of financially successful people! It's creating a spending plan that aligns with your goals. The 50/30/20 rule is your foundation: 50% for needs, 30% for wants, and 20% for savings. It's about intentional spending, not deprivation!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMessage.includes('emergency fund') || lowerMessage.includes('emergency savings')) {
    const responses = [
      `🛡️ An **emergency fund** is your financial safety net! It's money set aside for life's curveballs like car repairs, medical bills, or unexpected job changes. Think of it as insurance for your peace of mind. Aim for 3-6 months of living expenses, but start small - even $500 can save you from high-interest debt!`,
      `💪 An **emergency fund** is your financial superhero! It's cash you keep aside for when life throws you a surprise (and it will!). This prevents you from going into debt when unexpected expenses hit. Start with $500, then build toward 3-6 months of expenses. It's like having a financial parachute!`,
      `🚀 An **emergency fund** is your money's backup plan! It's the difference between handling a crisis with confidence vs. panic. Save 3-6 months of expenses, but don't wait - start with $500 today. It's the foundation of financial security and gives you options when life gets unpredictable!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMessage.includes('compound interest') || lowerMessage.includes('interest')) {
    return `💰 **Compound interest** is when your money earns interest, and then that interest earns more interest over time. It's why starting to save early is so powerful - your money grows faster the longer you leave it invested!`;
  }

  if (lowerMessage.includes('credit') || lowerMessage.includes('debt')) {
    return `💳 **Credit** is borrowing money you'll pay back later. While useful for big purchases, high-interest debt can quickly become expensive. Always pay more than the minimum payment and avoid carrying balances on high-interest cards.`;
  }

  if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
    return `📈 **Investing** is putting your money to work to potentially earn returns over time. For beginners, start with simple options like savings accounts, then learn about stocks, bonds, and mutual funds. Remember: higher potential returns usually mean higher risk.`;
  }

  if (lowerMessage.includes('retirement') || lowerMessage.includes('401k')) {
    return `🎯 **Retirement planning** starts now! Even small amounts saved early can grow significantly. If you have access to a 401(k) or IRA, contribute regularly. The earlier you start, the more time compound interest has to work in your favor.`;
  }

  if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
    return `📋 **Taxes** are mandatory payments to the government. Understanding basic tax concepts helps you make better financial decisions. Keep receipts for deductible expenses and consider consulting a tax professional for complex situations.`;
  }

  if (lowerMessage.includes('insurance') || lowerMessage.includes('protect')) {
    return `🛡️ **Insurance** protects you from financial losses due to accidents, illness, or damage. Health, auto, and renter's insurance are common types. While it costs money upfront, it can save you thousands if something goes wrong.`;
  }

  // More intelligent responses for common questions
  if (lowerMessage.includes('how') || lowerMessage.includes('what should') || lowerMessage.includes('tips')) {
    const responses = [
      `💡 Great question! I'd love to help you with specific advice. Tell me more about your situation - are you looking to save more, reduce spending, set goals, or learn about a particular financial topic?`,
      `🎯 I'm here to help! To give you the best advice, I need to understand your goals. Are you focused on building savings, managing debt, investing, or something else? The more specific you are, the better I can assist!`,
      `🚀 I'm excited to help you on your financial journey! To provide personalized guidance, tell me what you're working on - saving for something specific, managing expenses, building credit, or learning about investments?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const responses = [
      `👋 Hey there! I'm your SmartCents financial mentor, ready to help you crush your money goals! What would you like to work on today?`,
      `🎉 Hello! I'm here to be your financial cheerleader and advisor. Whether you want to save more, spend smarter, or learn about money, I've got your back!`,
      `💪 What's up! I'm your personal finance coach, here to help you build wealth and achieve financial freedom. What's on your mind today?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default response for unrecognized questions with more personality
  const defaultResponses = [
    `🤔 That's an interesting question! I'm your SmartCents financial mentor, and I can help with savings, spending, goals, investing, budgeting, and more. What specific area would you like to explore?`,
    `💭 Great question! I'm here to be your financial guide. I can help with everything from basic money concepts to personalized advice based on your spending patterns. What would you like to learn about?`,
    `🎯 I love that you're thinking about your finances! I'm your SmartCents mentor, and I'm here to help with savings strategies, spending analysis, goal setting, and financial education. What's your focus today?`
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartCents OpenAI Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Mentor tips: POST http://localhost:${PORT}/api/mentor-tip (OpenAI GPT-3.5)`);
  console.log(`✅ Chatbot: POST http://localhost:${PORT}/api/chatbot (OpenAI GPT-3.5)`);
  console.log(`✅ Frontend: http://localhost:${PORT}`);
  console.log(`✅ Mode: OpenAI GPT-3.5 with local fallback`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
});
