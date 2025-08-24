const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://smartcentsrecess5.netlify.app"  // 👈 your Netlify frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());

// ✅ OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY cannot be found in .env.');
  process.exit(1);
}
console.log('✅ OpenAI API key works');

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartCents AI Mentor Server is running', openai: 'Configured' });
});

// ✅ Mentor Tip endpoint
app.post('/api/mentor-tip', async (req, res) => {
  try {
    const { transactions, goals } = req.body;

    if (!transactions || !goals) {
      return res.status(400).json({ error: 'Missing transactions or goals data' });
    }

    const financialContext = buildFinancialContext(transactions, goals);

    const systemPrompt = `You are a helpful financial advisor chatbot for SmartCents, a financial management app for adolescents. 

RULES:
- Keep responses under 200 words
- Be encouraging and positive
- Give specific, actionable advice
- Always mention savings rate and top spending category
- Reference their goals when relevant

User's Financial Context:
${financialContext}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: 250,
      temperature: 0.7
    });

    const tip = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      tip: tip,
      model: "gpt-4o-mini",
      context: financialContext
    });

  } catch (error) {
    console.error('Error generating AI mentor tip:', error);
    res.status(500).json({
      error: 'Failed to generate AI mentor tip',
      fallback: 'I apologize, but I\'m having trouble analyzing your finances right now. Please try again in a moment.'
    });
  }
});

// ✅ Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, transactions = [], goals = [], score = 0 } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const financialContext = buildFinancialContext(transactions, goals);

    const systemPrompt = `You are SmartCents Chatbot, a helpful financial mentor for adolescents. 
Use the financial context provided to ground your advice. 
Always be short (under 150 words), positive, and practical. 
Mention savings rate, independence score, and top spending category when relevant. 

User's Financial Context:
${financialContext}
Independence Score: ${score}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ success: true, reply });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to generate chatbot response" });
  }
});

// ✅ Financial context builder
function buildFinancialContext(transactions, goals) {
  if (!transactions || transactions.length === 0) {
    return "No financial data available yet.";
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100).toFixed(1) : 0;
  const spendingRate = totalIncome > 0 ? (totalExpenses / totalIncome * 100).toFixed(1) : 0;

  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const topSpendingCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`);

  const activeGoals = goals.filter(g => (g.savedAmount || 0) < g.targetAmount);
  const completedGoals = goals.filter(g => (g.savedAmount || 0) >= g.targetAmount);

  const now = new Date();
  const lastWeek = transactions.filter(t => {
    const txDate = new Date(t.date);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return txDate >= weekAgo && t.type === 'expense';
  }).reduce((sum, t) => sum + t.amount, 0);

  const previousWeek = transactions.filter(t => {
    const txDate = new Date(t.date);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return txDate >= twoWeeksAgo && txDate < weekAgo && t.type === 'expense';
  }).reduce((sum, t) => sum + t.amount, 0);

  const spendingTrend = lastWeek > previousWeek ? 'increased' : lastWeek < previousWeek ? 'decreased' : 'stable';

  return `Income: $${totalIncome.toFixed(2)}
Expenses: $${totalExpenses.toFixed(2)}
Savings: $${totalSavings.toFixed(2)}
Savings Rate: ${savingsRate}%
Spending Rate: ${spendingRate}%
Top Spending Categories: ${topSpendingCategories.join(', ')}
Active Goals: ${activeGoals.length}
Completed Goals: ${completedGoals.length}
Recent Spending Trend: ${spendingTrend} (Last week: $${lastWeek.toFixed(2)}, Previous week: $${previousWeek.toFixed(2)})
Total Transactions: ${transactions.length}`;
}

app.listen(PORT, () => {
  console.log(`🚀 SmartCents AI Mentor Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Mentor Tips: POST http://localhost:${PORT}/api/mentor-tip`);
  console.log(`✅ Chatbot: POST http://localhost:${PORT}/api/chatbot`);
});
