const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const mongoose = require('mongoose');

const Transaction = require('./models/Transaction.js');
const Goal = require('./models/Goal.js');

dotenv.config();

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5550",
  "http://127.0.0.1:5550",
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

/* -------------------- TRANSACTION ROUTES -------------------- */

// Create new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error("❌ Error saving transaction:", err);
    res.status(500).json({ error: "Failed to save transaction" });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const transaction = await Transaction.findByIdAndUpdate(id, updates, { new: true });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("❌ Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

/* -------------------- GOAL ROUTES -------------------- */

// Create new goal
app.post('/api/goals', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error("❌ Error saving goal:", err);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

// Get all goals
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("❌ Error fetching goals:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// Update goal
app.put('/api/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const goal = await Goal.findByIdAndUpdate(id, updates, { new: true });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json(goal);
  } catch (err) {
    console.error("❌ Error updating goal:", err);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

/* -------------------- AI ENDPOINTS -------------------- */

// Mentor Tip
app.post('/api/mentor-tip', async (req, res) => {
  try {
    const { transactions, goals } = req.body;
    if (!transactions || !goals) {
      return res.status(400).json({ error: 'Missing transactions or goals data' });
    }

    const financialContext = buildFinancialContext(transactions, goals);

    const systemPrompt = `You are a helpful financial advisor chatbot for SmartCents. 

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
    res.json({ success: true, tip, model: "gpt-4o-mini", context: financialContext });

  } catch (error) {
    console.error('❌ Error generating AI mentor tip:', error);
    res.status(500).json({ error: 'Failed to generate AI mentor tip' });
  }
});

// Chatbot
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, transactions = [], goals = [], score = 0 } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const financialContext = buildFinancialContext(transactions, goals);

    const systemPrompt = `You are SmartCents Chatbot, a helpful financial mentor for adolescents. 
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
    console.error("❌ Chatbot error:", error);
    res.status(500).json({ error: "Failed to generate chatbot response" });
  }
});

/* -------------------- FINANCIAL CONTEXT BUILDER -------------------- */
function buildFinancialContext(transactions, goals) {
  if (!transactions || transactions.length === 0) return "No financial data available yet.";

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100).toFixed(1) : 0;

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

  return `Income: $${totalIncome.toFixed(2)}
Expenses: $${totalExpenses.toFixed(2)}
Savings: $${totalSavings.toFixed(2)}
Savings Rate: ${savingsRate}%
Top Spending Categories: ${topSpendingCategories.join(', ')}
Active Goals: ${activeGoals.length}
Completed Goals: ${completedGoals.length}
Total Transactions: ${transactions.length}`;
}

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 SmartCents AI Mentor Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Transactions: GET/POST http://localhost:${PORT}/api/transactions`);
  console.log(`✅ Goals: GET/POST http://localhost:${PORT}/api/goals`);
});
