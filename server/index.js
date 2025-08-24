const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for local development
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5550",
    "http://127.0.0.1:5550",
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

// AI Mentor Tip - Local implementation
app.post('/api/mentor-tip', async (req, res) => {
  try {
    const { transactions = [], goals = [] } = req.body;
    
    // Generate local mentor tip based on financial data
    const tip = generateLocalMentorTip(transactions, goals);
    
    res.json({ 
      success: true, 
      tip,
      source: 'local-intelligence',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error generating local mentor tip:', error);
    res.status(500).json({ 
      error: 'Failed to generate mentor tip',
      fallback: "Start tracking your income and expenses to get personalized financial advice."
    });
  }
});

// Chatbot - Local implementation
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message = '', transactions = [], goals = [], score = 0 } = req.body;
    
    if (!message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Generate local chatbot response
    const reply = generateLocalChatbotResponse(message, transactions, goals, score);
    
    res.json({ 
      success: true, 
      reply,
      source: 'local-intelligence',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Chatbot error:", error);
    res.status(500).json({ 
      error: "Failed to generate chatbot response",
      fallback: "I'm having trouble right now. Try asking me about your savings, spending, or goals!"
    });
  }
});

// Generate local mentor tip
function generateLocalMentorTip(transactions, goals) {
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

  // Common questions and responses
  if (lowerMessage.includes('savings') || lowerMessage.includes('save')) {
    if (savingsRate >= 20) {
      return `🎉 You're doing great with savings! Your current rate is ${savingsRate.toFixed(1)}%, which is above the recommended 20%. Keep up the excellent work!`;
    } else if (savingsRate >= 10) {
      return `👍 Good progress! You're saving ${savingsRate.toFixed(1)}% of your income. Try to increase this to 20% by reducing expenses or finding ways to earn more.`;
    } else {
      return `📊 You're currently saving ${savingsRate.toFixed(1)}% of your income. Aim for 20% by tracking every expense and finding areas to cut back.`;
    }
  }

  if (lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
    if (transactions.length === 0) {
      return "Start by tracking your first expense! Log everything you spend money on to see where your money goes.";
    }
    
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, '');
    
    return `Your top spending category is ${topCategory} ($${categoryTotals[topCategory].toFixed(2)}). Consider setting a budget for this category to control your spending.`;
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
    return generateLocalMentorTip(transactions, goals);
  }

  // Default response
  return `Hi! I'm your SmartCents financial mentor. I can help you with questions about savings, spending, goals, and your independence score. What would you like to know?`;
}

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartCents Local Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Mentor tips: POST http://localhost:${PORT}/api/mentor-tip`);
  console.log(`✅ Chatbot: POST http://localhost:${PORT}/api/chatbot`);
  console.log(`✅ Frontend: http://localhost:${PORT}`);
  console.log(`✅ Mode: Local Storage (No external dependencies)`);
});
