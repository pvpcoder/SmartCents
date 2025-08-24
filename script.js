// Backend URL configuration
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.backendUrl = 'http://localhost:3000';
    console.log('🌐 Detected LOCAL environment - using localhost:3000');
} else {
    window.backendUrl = 'https://smartcents-64ma.onrender.com';
    console.log('🌐 Detected PRODUCTION environment - using production backend');
}


let spendingPieChart = null;
let weeklyBarChart = null;

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = new Date().toISOString().split('T')[0];
    });

    setActiveNavigation();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
        case '':
            initializeDashboard();
            break;
        case 'add-expense.html':
            initializeAddExpense();
            break;
        case 'set-goal.html':
            initializeSetGoal();
            break;
        case 'mentor.html':
            initializeMentor();
            break;
    }
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));
    
            switch (currentPage) {
        case 'index.html':
        case '':
            const dashboardLink = document.querySelector('a[href="index.html"]');
            if (dashboardLink) dashboardLink.classList.add('active');
            break;
        case 'add-expense.html':
            const addExpenseLink = document.querySelector('a[href="add-expense.html"]');
            if (addExpenseLink) addExpenseLink.classList.add('active');
            break;
        case 'set-goal.html':
            const setGoalLink = document.querySelector('a[href="set-goal.html"]');
            if (setGoalLink) setGoalLink.classList.add('active');
            break;
        case 'mentor.html':
            const mentorLink = document.querySelector('a[href="mentor.html"]');
            if (mentorLink) mentorLink.classList.add('active');
            break;
        case 'budget-game.html':
            const gameLink = document.querySelector('a[href="budget-game.html"]');
            if (gameLink) gameLink.classList.add('active');
            break;
    }
}

function initializeDashboard() {
    console.log('🚀 Initializing dashboard...');
    console.log('🌐 Backend URL set to:', window.backendUrl);
    
    // Test backend connection
    if (window.backendUrl) {
        fetch(`${window.backendUrl}/api/health`)
            .then(response => response.json())
            .then(data => {
                console.log('✅ Backend health check successful:', data);
            })
            .catch(error => {
                console.error('❌ Backend health check failed:', error);
            });
    }
    
    loadTransactions();
    loadGoals();
    updateIndependenceScore();
    loadMentorTip();
    

    
    setTimeout(() => {
        loadScoreChangeLog();
    }, 2000);
}

window.refreshDashboard = function() {
    console.log('🔄 Refreshing dashboard...');
    loadTransactions();
    loadGoals();
    updateIndependenceScore();
    loadScoreChangeLog();
};
async function loadTransactions() {
    try {
        console.log('🔄 Loading transactions from backend...');
        const response = await fetch(`${window.backendUrl}/api/transactions`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const transactions = await response.json();

        // Save locally for offline use
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderSpendingPieChart(transactions);
        renderWeeklyBarChart(transactions);
        console.log(`✅ Loaded ${transactions.length} transactions`);
    } catch (err) {
        console.warn("⚠️ Falling back to localStorage transactions:", err);
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        renderSpendingPieChart(transactions);
        renderWeeklyBarChart(transactions);
    }
}


function renderSpendingPieChart(transactions) {
    const ctx = document.getElementById('spendingPieChart');
    if (!ctx) {
        console.log('❌ Spending pie chart canvas not found');
        return;
    }

    const categoryTotals = {};
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (spendingPieChart) spendingPieChart.destroy();

    if (data.length === 0) {
        spendingPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['No Data Yet'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#6b7280'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, usePointStyle: true }
                    }
                }
            }
        });
        return;
    }

    spendingPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                }
            }
        }
    });
}

function renderWeeklyBarChart(transactions) {
    const ctx = document.getElementById('weeklyBarChart');
    if (!ctx) return;

    const weeklyData = {};
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate >= oneWeekAgo) {
            const weekStart = new Date(transactionDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                weeklyData[weekKey].income += transaction.amount;
            } else {
                weeklyData[weekKey].expense += transaction.amount;
            }
        }
    });

    const labels = Object.keys(weeklyData).map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const incomeData = Object.values(weeklyData).map(week => week.income);
    const expenseData = Object.values(weeklyData).map(week => week.expense);

    if (weeklyBarChart) weeklyBarChart.destroy();

    if (labels.length === 0) {
        // Show empty chart instead of placeholder text
        weeklyBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No Data Yet'],
                datasets: [
                    { label: 'Income', data: [0], backgroundColor: '#48bb78', borderColor: '#38a169', borderWidth: 1 },
                    { label: 'Expenses', data: [0], backgroundColor: '#e53e3e', borderColor: '#c53030', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => '$' + value.toFixed(2) }
                    }
                },
                plugins: { legend: { position: 'top' } }
            }
        });
        return;
    }

    weeklyBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Income', data: incomeData, backgroundColor: '#48bb78', borderColor: '#38a169', borderWidth: 1 },
                { label: 'Expenses', data: expenseData, backgroundColor: '#e53e3e', borderColor: '#c53030', borderWidth: 1 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: value => '$' + value.toFixed(2) }
                }
            },
            plugins: { legend: { position: 'top' } }
        }
    });
}

// ===== GOALS =====
async function loadGoals() {
    try {
        console.log('🔄 Loading goals from backend...');
        const response = await fetch(`${window.backendUrl}/api/goals`);
        if (!response.ok) throw new Error("Failed to fetch goals");
        const goals = await response.json();

        // Save locally for offline use
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals(goals);
        console.log(`✅ Loaded ${goals.length} goals`);
    } catch (err) {
        console.warn("⚠️ Falling back to localStorage goals:", err);
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        renderGoals(goals);
    }
}


function renderGoals(goals) {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;

    if (goals.length === 0) {
        goalsList.innerHTML = '<p class="no-goals">No goals set yet. <a href="set-goal.html">Create your first goal</a></p>';
        return;
    }

    goalsList.innerHTML = goals.map(goal => {
        const progress = (goal.savedAmount || 0) / goal.targetAmount * 100;
        const progressPercent = Math.min(progress, 100);
        const isCompleted = (goal.savedAmount || 0) >= goal.targetAmount;

        return `
            <div class="goal-item ${isCompleted ? 'goal-completed' : ''}">
                <div class="goal-name">${goal.name} ${isCompleted ? '<span class="completion-badge">✓ Completed!</span>' : ''}</div>
                <div class="goal-progress"><div class="progress-bar"><div class="progress-fill" style="width: ${progressPercent}%"></div></div></div>
                <div class="goal-stats"><span>$${(goal.savedAmount || 0).toFixed(2)} / $${goal.targetAmount.toFixed(2)}</span><span>${progressPercent.toFixed(1)}%</span></div>
                <div class="goal-actions">${!isCompleted ? `<button class="btn btn-secondary btn-sm" onclick="openAddProgressModal('${goal.id}', '${goal.name}', ${goal.savedAmount || 0}, ${goal.targetAmount})">Add Progress</button>` : '<span class="completion-message">Goal completed! 🎉</span>'}</div>
            </div>
        `;
    }).join('');
}

// ===== INDEPENDENCE SCORE =====
async function updateIndependenceScore() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const newScore = calculateIndependenceScore(transactions, goals);
        
        console.log('🔄 Updating independence score:', { 
            newScore, 
            transactionsCount: transactions.length, 
            goalsCount: goals.length 
        });
        
        // Track score history
        trackScoreHistory(newScore);
        
        const scoreElement = document.getElementById('independenceScore');
        if (scoreElement) {
            const previousScore = parseInt(scoreElement.textContent) || 0;
            scoreElement.textContent = newScore;
            
            console.log(`📊 Score change: ${previousScore} → ${newScore} (${newScore > previousScore ? '+' : ''}${newScore - previousScore})`);
            
            // Show score change indicator
            if (newScore > previousScore) {
                showScoreChange('+', newScore - previousScore, 'positive');
            } else if (newScore < previousScore) {
                showScoreChange('-', previousScore - newScore, 'negative');
            }
        }
        

        
        // Update the score change log
        setTimeout(() => {
            loadScoreChangeLog();
        }, 200);
        
    } catch (error) {
        console.error('Error updating independence score:', error);
    }
}

// Track score history for trends (hourly for hackathon demo)
function trackScoreHistory(currentScore) {
    const now = new Date();
    const hourKey = now.toISOString().slice(0, 13); // YYYY-MM-DDTHH format
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '{}');
    
    console.log('📊 trackScoreHistory called with:', { currentScore, now: now.toISOString(), hourKey });
    
    // Always track minute-level changes for more granular tracking
    const minuteKey = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
    const minuteHistory = JSON.parse(localStorage.getItem('scoreMinuteHistory') || '{}');
    minuteHistory[minuteKey] = currentScore;
    
    // Keep only last 100 minute entries
    const minutes = Object.keys(minuteHistory).sort();
    if (minutes.length > 100) {
        minutes.slice(0, minutes.length - 100).forEach(minute => delete minuteHistory[minute]);
    }
    
    localStorage.setItem('scoreMinuteHistory', JSON.stringify(minuteHistory));
    console.log('📊 Minute history updated:', { minuteKey, currentScore });
    
    // Always update when score changes (remove the threshold check)
    if (!scoreHistory[hourKey] || scoreHistory[hourKey] !== currentScore) {
        scoreHistory[hourKey] = currentScore;
        
        // Keep only last 24 hours of history for hackathon demo
        const hours = Object.keys(scoreHistory).sort();
        if (hours.length > 24) {
            hours.slice(0, hours.length - 24).forEach(hour => delete scoreHistory[hour]);
        }
        
        localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
        console.log('📊 Score history updated:', { hourKey, currentScore, totalEntries: Object.keys(scoreHistory).length });
    }
    
    // Ensure we have at least 2 entries for change calculation
    // If this is the first entry, create a previous entry with a different score
    const allHistory = Object.keys(scoreHistory).length > 0 ? scoreHistory : minuteHistory;
    if (Object.keys(allHistory).length === 1) {
        console.log('⚠️ Only one history entry found, creating a previous entry for change calculation');
        
        // Create a previous entry with a different score to enable change calculation
        const previousTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
        const previousMinuteKey = previousTime.toISOString().slice(0, 16);
        
        // Use a different score (e.g., 0 or currentScore - 10)
        const previousScore = Math.max(0, currentScore - 10);
        
        minuteHistory[previousMinuteKey] = previousScore;
        localStorage.setItem('scoreMinuteHistory', JSON.stringify(minuteHistory));
        
        console.log('📊 Created previous entry for change calculation:', { previousMinuteKey, previousScore });
    }
}

// Show score change indicator
function showScoreChange(sign, points, type) {
    const scoreElement = document.getElementById('independenceScore');
    if (!scoreElement) return;
    
    const changeIndicator = document.createElement('div');
    changeIndicator.className = `score-change score-change-${type}`;
    changeIndicator.textContent = `${sign}${points}`;
    changeIndicator.style.cssText = `
        position: absolute;
        top: -20px;
        right: 0;
        font-size: 0.8rem;
        font-weight: bold;
        color: ${type === 'positive' ? '#48bb78' : '#e53e3e'};
        animation: scoreChange 2s ease-out forwards;
    `;
    
    // Make score element relative positioned
    scoreElement.style.position = 'relative';
    scoreElement.appendChild(changeIndicator);
    
    // Remove indicator after animation
    setTimeout(() => {
        if (changeIndicator.parentNode) {
            changeIndicator.parentNode.removeChild(changeIndicator);
        }
    }, 2000);
}







function calculateIndependenceScore(transactions = [], goals = []) {
    let score = 0;
    if (transactions.length === 0) return score;

    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    if (income === 0) return score;

    const savings = income - expenses;
    const savingsRate = (savings / income) * 100;

    // Savings rate points (max 30) - More dynamic
    if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    else if (savingsRate < 0) score -= 10; // Penalty for negative savings

    // Spending categories points (max 30) - More dynamic
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const categoryCount = Object.keys(categoryTotals).length;
    
    if (categoryCount >= 4) score += 30;
    else if (categoryCount >= 3) score += 20;
    else if (categoryCount >= 2) score += 10;
    else if (categoryCount === 1) score += 5; // Minimal points for single category
    else score -= 5; // Penalty for no spending categories (might indicate incomplete tracking)

    // Goals points (max 20) - More dynamic
    if (goals.length > 0) {
        const activeGoals = goals.filter(g => (g.savedAmount || 0) < g.targetAmount);
        const completedGoals = goals.filter(g => (g.savedAmount || 0) >= g.targetAmount);
        
        score += Math.min(completedGoals.length * 5, 10); // Max 10 for completed goals
        score += Math.min(activeGoals.length * 3, 10);    // Max 10 for active goals
    }

    // Savings consistency (max 15) - New dynamic factor
    if (savings > 0) {
        // Check if savings are consistent over time
        const recentTransactions = transactions
            .filter(t => new Date(t.timestamp) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (recentTransactions.length > 0) {
            const recentIncome = recentTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const recentExpenses = recentTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const recentSavings = recentIncome - recentExpenses;
            
            if (recentSavings > 0) score += 15;
            else if (recentSavings < 0) score -= 5; // Penalty for recent overspending
        }
    }

    // Transaction consistency (max 10) - New factor
    if (transactions.length >= 10) score += 10;
    else if (transactions.length >= 5) score += 5;
    else if (transactions.length < 3) score -= 5; // Penalty for insufficient tracking

    // Daily challenges points (max 25) - More dynamic
    const dateKey = getCurrentDateKey();
    const storedChallenges = localStorage.getItem(`dailyChallenges_${dateKey}`);
    if (storedChallenges) {
        const todaysChallenges = JSON.parse(storedChallenges);
        const completedChallenges = todaysChallenges.filter(c => c.completed);
        const challengePoints = completedChallenges.reduce((sum, c) => sum + c.points, 0);
        score += Math.min(challengePoints, 25);
    }

    // Score decay for inactivity (new feature)
    const lastTransactionDate = transactions.length > 0 ? 
        Math.max(...transactions.map(t => new Date(t.timestamp).getTime())) : 0;
    const daysSinceLastActivity = (Date.now() - lastTransactionDate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastActivity > 7) score -= 5;  // Penalty for 1+ week of inactivity
    if (daysSinceLastActivity > 14) score -= 10; // Bigger penalty for 2+ weeks
    if (daysSinceLastActivity > 30) score -= 20; // Major penalty for 1+ month

    // Ensure score stays within reasonable bounds
    return Math.max(0, Math.min(score, 100));
}

// ===== MENTOR TIP =====
async function loadMentorTip() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        
        // Try AI-powered tip first, fallback to basic tip if API fails
        try {
            const aiTip = await generateAIMentorTip(transactions, goals);
            const tipElement = document.getElementById('mentorTip');
            if (tipElement) {
                // Clean up asterisks and convert markdown-style formatting to HTML
                const cleanedTip = aiTip
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert **text** to <strong>text</strong>
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Convert *text* to <em>text</em>
                    .replace(/\*/g, '');                               // Remove any remaining asterisks
                tipElement.innerHTML = `<p>${cleanedTip}</p>`;
            }
        } catch (aiError) {
            console.log('AI tip failed, using basic tip:', aiError);
            const basicTip = generateMentorTip(transactions);
            const tipElement = document.getElementById('mentorTip');
            if (tipElement) tipElement.innerHTML = `<p>${basicTip}</p>`;
        }
    } catch (error) {
        console.error('Error loading mentor tip:', error);
    }
}

async function generateAIMentorTip(transactions, goals) {
    // Check if backend is configured
    if (!window.backendUrl) {
        throw new Error('Backend not configured');
    }

    try {
        // Calculate current independence score
        const currentScore = calculateIndependenceScore(transactions, goals);
        
        const response = await fetch(`${window.backendUrl}/api/mentor-tip`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactions, goals, score: currentScore })
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            return data.tip;
        } else {
            throw new Error(data.error || 'Unknown backend error');
        }

    } catch (error) {
        console.error('Backend API error:', error);
        throw error;
    }
}



function generateMentorTip(transactions) {
    if (transactions.length === 0) {
        return "Start tracking your income and expenses to get personalized financial advice.";
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = totalIncome - totalExpenses;
    const spendingRate = totalIncome > 0 ? totalExpenses / totalIncome : 0;

    // Check if spending is under control (spending less than 80% = saving more than 20%)
    if (spendingRate <= 0.8) {
        return "Great job! You are saving more than 20% of your income. Keep up the excellent financial habits.";
    } else if (spendingRate <= 0.9) {
        return "Your spending looks balanced. Consider setting specific savings goals to accelerate your financial independence.";
    } else {
        return "Try to keep your expenses under 80% of your income. Consider setting up automatic transfers to make saving easier!";
    }
}

// ===== MENTOR =====
function initializeMentor() {
    loadPersonalizedAdvice();
    loadSpendingAnalysis();
    initializeDailyChallenges();
}

async function loadPersonalizedAdvice() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const advice = generatePersonalizedAdvice(transactions);
        const adviceElement = document.getElementById('personalizedAdvice');
        if (adviceElement) adviceElement.innerHTML = `<p>${advice}</p>`;
    } catch (error) {
        console.error('Error loading personalized advice:', error);
    }
}

function generatePersonalizedAdvice(transactions) {
    if (transactions.length === 0) return "Start tracking your finances to receive personalized advice tailored to your spending patterns.";
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = totalIncome - totalExpenses;
    const spendingRate = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    const savingsRate = totalIncome > 0 ? totalSavings / totalIncome : 0;

    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const maxCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, '');
    const maxCategoryPercentage = totalExpenses > 0 ? categoryTotals[maxCategory] / totalExpenses : 0;

    // Check if spending is under control (spending less than 80% = saving more than 20%)
    if (spendingRate <= 0.8) {
        return "Great job! You're saving more than 20% of your income.";
    } else if (spendingRate <= 0.9) {
        return maxCategoryPercentage > 0.5
            ? `Good progress, but ${maxCategory} is eating too much of your budget.`
            : "Keep going! Try raising your savings rate to 20%.";
    } else {
        return maxCategoryPercentage > 0.4
            ? `Consider reducing ${maxCategory} spending to save more. Try the 50/30/20 rule.`
            : "Your spending is above 90% of income. Aim to keep expenses under 80%.";
    }
}

async function loadSpendingAnalysis() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const analysis = generateSpendingAnalysis(transactions);
        const analysisElement = document.getElementById('spendingAnalysis');
        if (analysisElement) analysisElement.innerHTML = analysis;
    } catch (error) {
        console.error('Error loading spending analysis:', error);
    }
}

function generateSpendingAnalysis(transactions) {
    if (transactions.length === 0) return '<p>No spending data available yet.</p>';

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100).toFixed(1) : 0;

    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .map(([cat, amt]) => `<strong>${cat}:</strong> $${amt.toFixed(2)} (${((amt / totalExpenses) * 100).toFixed(1)}%)`)
        .join('<br>');

    return `
        <div class="analysis-summary">
            <p><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</p>
            <p><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</p>
            <p><strong>Total Savings:</strong> $${totalSavings.toFixed(2)}</p>
            <p><strong>Savings Rate:</strong> ${savingsRate}%</p>
        </div>
        <div class="category-breakdown"><h4>Spending by Category:</h4><p>${categoryBreakdown}</p></div>
    `;
}

// ===== ADD EXPENSE =====
function initializeAddExpense() {
    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', handleTransactionSubmit);
    }
    
    const transactionTypeSelect = document.getElementById('transactionType');
    if (transactionTypeSelect) {
        transactionTypeSelect.addEventListener('change', handleTransactionTypeChange);
        handleTransactionTypeChange();
    }
    
    loadRecentTransactions();
}

function handleTransactionTypeChange() {
    const transactionType = document.getElementById('transactionType').value;
    const incomeGroup = document.getElementById('categoryGroup');
    const expenseGroup = document.getElementById('expenseCategoryGroup');
    const incomeSelect = document.getElementById('category');
    const expenseSelect = document.getElementById('expenseCategory');
    
    if (transactionType === 'income') {
        incomeGroup.style.display = 'block';
        expenseGroup.style.display = 'none';
        incomeSelect.required = true;
        expenseSelect.required = false;
        expenseSelect.value = '';
    } else {
        incomeGroup.style.display = 'none';
        expenseGroup.style.display = 'block';
        incomeSelect.required = false;
        expenseSelect.required = true;
        incomeSelect.value = '';
    }
}

async function handleTransactionSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const transactionType = formData.get('transactionType');
    const category = transactionType === 'income' ? formData.get('category') : formData.get('expenseCategory');
    
    const transaction = {
        type: transactionType,
        amount: parseFloat(formData.get('amount')),
        category: category,
        date: formData.get('date'),
        note: formData.get('note'),
        timestamp: new Date().toISOString()
    };
    
    try {
        // Try to save to backend first
        if (window.backendUrl) {
            try {
                const response = await fetch(`${window.backendUrl}/api/transactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaction)
                });
                
                if (response.ok) {
                    const savedTransaction = await response.json();
                    transaction._id = savedTransaction._id; // Store backend ID
                    console.log('✅ Transaction saved to backend:', savedTransaction);
                } else {
                    console.warn('⚠️ Failed to save to backend, using localStorage only');
                }
            } catch (apiError) {
                console.log('⚠️ Backend API not accessible, using localStorage only:', apiError);
            }
        }
        
        // Save to localStorage
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        event.target.reset();
        event.target.querySelector('input[type="date"]').value = new Date().toISOString().split('T')[0];
        
        showMessage('Transaction added successfully!', 'success');
        loadRecentTransactions();
        
        // Update independence score and charts immediately
        updateIndependenceScore();
        
    } catch (error) {
        console.error('Error adding transaction:', error);
        showMessage('Error adding transaction. Please try again.', 'error');
    }
}

async function loadRecentTransactions() {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        renderRecentTransactions(transactions);
    } catch (error) {
        console.error('Error loading recent transactions:', error);
        renderRecentTransactions([]);
    }
}

function renderRecentTransactions(transactions) {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-data">No transactions yet. Add your first transaction above!</p>';
        return;
    }

    transactionsList.innerHTML = transactions.map(transaction => {
        const date = new Date(transaction.date).toLocaleDateString();
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const amountPrefix = transaction.type === 'income' ? '+' : '-';
        
        return `
            <div class="transaction-item">
                <div class="transaction-header">
                    <span class="transaction-amount ${amountClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</span>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
                <div class="transaction-date">${date}</div>
                ${transaction.note ? `<div class="transaction-note">${transaction.note}</div>` : ''}
            </div>
        `;
    }).join('');
}

// ===== SET GOAL =====
function initializeSetGoal() {
    const form = document.getElementById('goalForm');
    if (form) {
        form.addEventListener('submit', handleGoalSubmit);
    }
    
    loadGoalsProgress();
    loadGoalPredictions();
}

async function handleGoalSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const goal = {
        id: Date.now().toString(),
        name: formData.get('goalName'),
        targetAmount: parseFloat(formData.get('targetAmount')),
        targetDate: formData.get('targetDate') || null,
        note: formData.get('goalNote') || '',
        savedAmount: 0,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Try to save to backend first
        if (window.backendUrl) {
            try {
                const response = await fetch(`${window.backendUrl}/api/goals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(goal)
                });
                
                if (response.ok) {
                    const savedGoal = await response.json();
                    goal._id = savedGoal._id; // Store backend ID
                    console.log('✅ Goal saved to backend:', savedGoal);
                } else {
                    console.warn('⚠️ Failed to save to backend, using localStorage only');
                }
            } catch (apiError) {
                console.log('⚠️ Backend API not accessible, using localStorage only:', apiError);
            }
        }
        
        // Save to localStorage
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
        
        event.target.reset();
        event.target.querySelector('input[type="date"]').value = new Date().toISOString().split('T')[0];
        
        showMessage('Goal created successfully!', 'success');
        loadGoalsProgress();
        loadGoalPredictions();
        
        // Update independence score immediately if on dashboard
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            updateIndependenceScore();
        }
        
    } catch (error) {
        console.error('Error creating goal:', error);
        showMessage('Error creating goal. Please try again.', 'error');
    }
}

async function loadGoalsProgress() {
    try {
        let goals = JSON.parse(localStorage.getItem('goals') || '[]');
        goals = goals.map(goal => {
            if (!goal.id) {
                return { ...goal, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
            }
            return goal;
        });
        renderGoalsProgress(goals);
    } catch (error) {
        console.error('Error loading goals progress:', error);
        renderGoalsProgress([]);
    }
}

function renderGoalsProgress(goals) {
    const goalsProgress = document.getElementById('goalsProgress');
    if (!goalsProgress) return;

    if (goals.length === 0) {
        goalsProgress.innerHTML = '<p class="no-goals">No goals set yet. Create your first goal above!</p>';
        return;
    }

    goalsProgress.innerHTML = goals.map(goal => {
        const progress = (goal.savedAmount || 0) / goal.targetAmount * 100;
        const progressPercent = Math.min(progress, 100);
        const isCompleted = (goal.savedAmount || 0) >= goal.targetAmount;
        
        return `
            <div class="goal-item ${isCompleted ? 'goal-completed' : ''}">
                <div class="goal-header">
                    <div class="goal-name">
                        ${goal.name}
                        ${isCompleted ? '<span class="completion-badge">✓ Completed!</span>' : ''}
                    </div>
                    <button class="delete-goal-btn" onclick="deleteGoal('${goal.id}', '${goal.name}')" title="Delete Goal">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                <div class="goal-stats">
                    <span>$${(goal.savedAmount || 0).toFixed(2)} / $${goal.targetAmount.toFixed(2)}</span>
                    <span>${progressPercent.toFixed(1)}%</span>
                </div>
                <div class="goal-actions">
                    ${!isCompleted ? `<button class="btn btn-secondary btn-sm" onclick="openAddProgressModal('${goal.id}', '${goal.name}', ${goal.savedAmount || 0}, ${goal.targetAmount})">
                        Add Progress
                    </button>` : '<span class="completion-message">Goal completed! 🎉</span>'}
                </div>
            </div>
        `;
    }).join('');
}

async function loadGoalPredictions() {
    try {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        renderGoalPredictions(goals, transactions);
    } catch (error) {
        console.error('Error loading goal predictions:', error);
        renderGoalPredictions([], []);
    }
}

function renderGoalPredictions(goals, transactions) {
    const goalPredictions = document.getElementById('goalPredictions');
    if (!goalPredictions) return;

    if (goals.length === 0) {
        goalPredictions.innerHTML = '<p class="no-predictions">Add some goals to see predictions</p>';
        return;
    }

    goalPredictions.innerHTML = goals.map(goal => {
        const prediction = calculateGoalPrediction(goal, transactions);
        return `
            <div class="prediction-item">
                <h3>${goal.name}</h3>
                <p>${prediction}</p>
            </div>
        `;
    }).join('');
}

function calculateGoalPrediction(goal, transactions) {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const averageSavings = totalIncome - totalExpenses;
    const remainingAmount = goal.targetAmount - (goal.savedAmount || 0);
    
    if (averageSavings <= 0) {
        return "You need to increase your savings rate to reach this goal. Consider reducing expenses or increasing income.";
    }
    
    const weeksToGoal = Math.ceil(remainingAmount / averageSavings);
    
    if (weeksToGoal <= 0) {
        return "Congratulations! You have already reached this goal.";
    } else if (weeksToGoal === 1) {
        return `At your current pace, you will reach this goal in 1 week.`;
    } else if (weeksToGoal < 52) {
        return `At your current pace, you will reach this goal in ${weeksToGoal} weeks.`;
    } else {
        const yearsToGoal = (weeksToGoal / 52).toFixed(1);
        return `At your current pace, you will reach this goal in ${yearsToGoal} years. Consider increasing your savings rate.`;
    }
}

// ===== DAILY CHALLENGES =====
const dailyChallenges = [
    { id: 'no-spend-day', name: 'No-Spend Day', description: 'Go one full day without spending any money', target: 1, difficulty: 'easy', points: 2, type: 'daily', action: 'Mark Completed' },
    { id: 'save-small', name: 'Save $2 Today', description: 'Put aside $2 from your allowance or income', target: 2, difficulty: 'easy', points: 2, type: 'daily', action: 'Add $1 Saved' },
    { id: 'track-expenses', name: 'Track 3 Expenses', description: 'Log at least 3 expenses in your tracker', target: 3, difficulty: 'easy', points: 1, type: 'daily', action: 'Log Transaction' },
    { id: 'budget-check', name: 'Check Your Budget', description: 'Review your spending from yesterday', target: 1, difficulty: 'easy', points: 1, type: 'daily', action: 'Mark Reviewed' },
    { id: 'save-medium', name: 'Save $5 Today', description: 'Put aside $5 from your allowance or income', target: 5, difficulty: 'medium', points: 4, type: 'daily', action: 'Add $1 Saved' },
    { id: 'no-fun-spending', name: 'No Fun Spending', description: 'Avoid spending on entertainment today', target: 1, difficulty: 'medium', points: 3, type: 'daily', action: 'Mark Completed' },
    { id: 'cook-meal', name: 'Cook a Meal', description: 'Prepare a meal at home instead of eating out', target: 1, difficulty: 'medium', points: 3, type: 'daily', action: 'Mark Completed' },
    { id: 'find-deal', name: 'Find a Deal', description: 'Find and use a coupon or discount', target: 1, difficulty: 'medium', points: 3, type: 'daily', action: 'Mark Completed' },
    { id: 'save-hard', name: 'Save $10 Today', description: 'Put aside $10 from your allowance or income', target: 10, difficulty: 'hard', points: 7, type: 'daily', action: 'Add $2 Saved' },
    { id: 'no-spend-weekend', name: 'Weekend No-Spend', description: 'Go the entire weekend without spending', target: 1, difficulty: 'hard', points: 8, type: 'daily', action: 'Mark Completed' },
    { id: 'side-hustle', name: 'Earn Extra Money', description: 'Find a way to earn at least $5 today', target: 1, difficulty: 'hard', points: 6, type: 'daily', action: 'Mark Completed' },
    { id: 'sell-item', name: 'Sell Something', description: 'Sell an item you no longer need', target: 1, difficulty: 'hard', points: 6, type: 'daily', action: 'Mark Completed' }
];

function getCurrentDateKey() {
    return new Date().toISOString().split('T')[0];
}

function getTodaysChallenges() {
    const dateKey = getCurrentDateKey();
    const stored = localStorage.getItem(`dailyChallenges_${dateKey}`);
    if (stored) return JSON.parse(stored);

    const shuffled = [...dailyChallenges].sort(() => 0.5 - Math.random());
    const todays = shuffled.slice(0, 3).map(c => ({ ...c, progress: 0, completed: false, date: dateKey }));
    localStorage.setItem(`dailyChallenges_${dateKey}`, JSON.stringify(todays));
    return todays;
}

function initializeDailyChallenges() {
    renderDailyChallenges(getTodaysChallenges());
}

function renderDailyChallenges(challenges) {
    const container = document.getElementById('dailyChallenges');
    if (!container) return;
    
    container.innerHTML = challenges.map(challenge => `
        <div class="challenge-item ${challenge.completed ? 'challenge-completed' : ''}">
            <div class="challenge-header">
                <h3>${challenge.name}</h3>
                <span class="difficulty-badge difficulty-${challenge.difficulty}">${challenge.difficulty.toUpperCase()}</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(challenge.progress / challenge.target) * 100}%"></div>
                </div>
                <span class="progress-text">${challenge.progress}/${challenge.target}</span>
            </div>
            <div class="challenge-actions">
                ${challenge.completed ? 
                    `<span class="completion-badge">Completed! +${challenge.points} points</span>` :
                    `<button onclick="completeDailyChallenge('${challenge.id}')" class="challenge-btn challenge-btn-${challenge.difficulty}">
                        ${challenge.action}
                    </button>`
                }
            </div>
        </div>
    `).join('');
}

function completeDailyChallenge(challengeId) {
    const dateKey = getCurrentDateKey();
    const storedChallenges = localStorage.getItem(`dailyChallenges_${dateKey}`);
    
    if (!storedChallenges) return;
    
    const challenges = JSON.parse(storedChallenges);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge || challenge.completed) return;
    
    if (challenge.id.includes('save')) {
        const increment = challenge.difficulty === 'hard' ? 2 : 1;
        challenge.progress = Math.min(challenge.progress + increment, challenge.target);
    } else {
        challenge.progress = challenge.target;
    }
    
    if (challenge.progress >= challenge.target && !challenge.completed) {
        challenge.completed = true;
        const pointsEarned = challenge.points;
        showChallengeCompletion(challenge.name, pointsEarned);
        
        // Update independence score properly to track changes
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            updateIndependenceScore();
        } else {
            // If not on dashboard, just update the display
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const goals = JSON.parse(localStorage.getItem('goals') || '[]');
            const currentScore = calculateIndependenceScore(transactions, goals);
            
            const scoreElement = document.getElementById('independenceScore');
            if (scoreElement) {
                scoreElement.textContent = currentScore;
            }
        }
    }
    
    localStorage.setItem(`dailyChallenges_${dateKey}`, JSON.stringify(challenges));
    renderDailyChallenges(challenges);
}

function showChallengeCompletion(challengeName, points) {
    const notification = document.createElement('div');
    notification.className = 'challenge-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🎉 Challenge Completed!</h4>
            <p>${challengeName}</p>
            <p class="points-earned">+${points} Independence Score Points!</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function resetDailyChallenges() {
    const dateKey = getCurrentDateKey();
    localStorage.removeItem(`dailyChallenges_${dateKey}`);
    initializeDailyChallenges();
}

// ===== UTILITY FUNCTIONS =====
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#48bb78';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#e53e3e';
    } else {
        messageDiv.style.backgroundColor = '#667eea';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// ===== GOAL PROGRESS MODAL =====
function openAddProgressModal(goalId, goalName, currentAmount, targetAmount) {
    const modalHTML = `
        <div id="progressModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Progress to "${goalName}"</h3>
                    <button class="modal-close" onclick="closeAddProgressModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="progress-summary">
                        <p><strong>Current Progress:</strong> $${currentAmount.toFixed(2)} / $${targetAmount.toFixed(2)}</p>
                        <p><strong>Remaining:</strong> $${(targetAmount - currentAmount).toFixed(2)}</p>
                    </div>
                    <form id="progressForm" class="progress-form">
                        <div class="form-group">
                            <label for="progressAmount">Amount to Add</label>
                            <div class="amount-input">
                                <span class="currency-symbol">$</span>
                                <input type="number" id="progressAmount" name="progressAmount" step="0.01" min="0.01" max="${targetAmount - currentAmount}" required placeholder="0.00">
                            </div>
                            <small class="form-help">Maximum: $${(targetAmount - currentAmount).toFixed(2)}</small>
                        </div>
                        <div class="form-group">
                            <label for="progressNote">Note (Optional)</label>
                            <textarea id="progressNote" name="progressNote" rows="2" placeholder="What did you save this money from?"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Progress</button>
                            <button type="button" class="btn btn-outline" onclick="closeAddProgressModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const form = document.getElementById('progressForm');
    form.addEventListener('submit', (e) => handleProgressSubmit(e, goalId));
    
    document.getElementById('progressModal').style.display = 'flex';
}

function closeAddProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.remove();
    }
}

async function handleProgressSubmit(event, goalId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const amount = parseFloat(formData.get('progressAmount'));
    const note = formData.get('progressNote') || '';
    
    try {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex !== -1) {
            goals[goalIndex].savedAmount = (goals[goalIndex].savedAmount || 0) + amount;
            
            // Try to update in backend first
            if (window.backendUrl && goals[goalIndex]._id) {
                try {
                    const response = await fetch(`${window.backendUrl}/api/goals/${goals[goalIndex]._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            savedAmount: goals[goalIndex].savedAmount
                        })
                    });
                    
                    if (response.ok) {
                        console.log('✅ Goal progress updated in backend');
                    } else {
                        console.warn('⚠️ Failed to update goal progress in backend');
                    }
                } catch (apiError) {
                    console.log('⚠️ Backend API not accessible, using localStorage only:', apiError);
                }
            }
            
            localStorage.setItem('goals', JSON.stringify(goals));
            
            const updatedGoal = goals[goalIndex];
            if (updatedGoal.savedAmount >= updatedGoal.targetAmount) {
                showMessage(`🎉 Congratulations! Your goal "${updatedGoal.name}" has been completed! 🎉`, 'success');
            } else {
                showMessage(`Added $${amount.toFixed(2)} to your goal!`, 'success');
            }
        } else {
            showMessage('Goal not found. Please try again.', 'error');
            return;
        }
        
        closeAddProgressModal();
        
        if (window.location.pathname.includes('set-goal.html')) {
            loadGoalsProgress();
            loadGoalPredictions();
        } else {
            loadGoals();
            updateIndependenceScore();
        }
        
        const currentGoals = JSON.parse(localStorage.getItem('goals') || '[]');
        if (window.location.pathname.includes('set-goal.html')) {
            renderGoalsProgress(currentGoals);
        } else {
            renderGoals(currentGoals);
        }
        
    } catch (error) {
        console.error('Error updating goal progress:', error);
        showMessage('Error updating goal progress. Please try again.', 'error');
    }
}

// ===== RESET FUNCTIONALITY =====
function resetAllGoals() {
    if (confirm('Are you sure you want to reset all goals? This action cannot be undone.')) {
        try {
            localStorage.removeItem('goals');
            showMessage('All goals have been reset!', 'success');
            
            if (window.location.pathname.includes('set-goal.html')) {
                loadGoalsProgress();
                loadGoalPredictions();
            } else {
                loadGoals();
                updateIndependenceScore();
            }
            
        } catch (error) {
            console.error('Error resetting goals:', error);
            showMessage('Error resetting goals. Please try again.', 'error');
        }
    }
}

function resetAllTransactions() {
    if (confirm('Are you sure you want to reset all transactions? This action cannot be undone.')) {
        try {
            localStorage.removeItem('transactions');
            showMessage('All transactions have been reset!', 'success');
            
            if (window.location.pathname.includes('add-expense.html')) {
                loadRecentTransactions();
            } else {
                loadTransactions();
                updateIndependenceScore();
            }
            
        } catch (error) {
            console.error('Error resetting transactions:', error);
            showMessage('Error resetting transactions. Please try again.', 'error');
        }
    }
}



// ===== GLOBAL EXPORTS =====
window.handleTransactionTypeChange = handleTransactionTypeChange;
window.calculateIndependenceScore = calculateIndependenceScore;
window.resetDailyChallenges = resetDailyChallenges;
window.completeDailyChallenge = completeDailyChallenge;
window.openAddProgressModal = openAddProgressModal;
window.closeAddProgressModal = closeAddProgressModal;
window.resetAllGoals = resetAllGoals;
window.resetAllTransactions = resetAllTransactions;
window.toggleScoreLog = toggleScoreLog;
















// ===== GOAL MANAGEMENT =====

// Delete goal with confirmation
function deleteGoal(goalId, goalName) {
    const confirmed = confirm(`⚠️ WARNING: This will permanently delete your goal "${goalName}"!\n\nAre you sure you want to delete this goal? This action cannot be undone.`);
    
    if (confirmed) {
        try {
            // Get current goals from localStorage
            const goals = JSON.parse(localStorage.getItem('goals') || '[]');
            
            // Remove the goal with matching ID
            const updatedGoals = goals.filter(goal => goal.id !== goalId);
            
            // Save updated goals back to localStorage
            localStorage.setItem('goals', JSON.stringify(updatedGoals));
            
            // Refresh the goals display
            loadGoalsProgress();
            loadGoalPredictions();
            
            // Show success message
            alert(`✅ Goal "${goalName}" has been permanently deleted.`);
            
        } catch (error) {
            console.error('Error deleting goal:', error);
            alert('❌ Error deleting goal. Please try again.');
        }
    }
}

  
// Toggle score log expansion
function toggleScoreLog() {
    const container = document.getElementById('scoreLogContainer');
    const button = document.getElementById('viewAllChanges');
    
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
        button.textContent = 'View All';
    } else {
        container.classList.add('expanded');
        button.textContent = 'Collapse';
    }
}

// Load and display score change log on dashboard
function loadScoreChangeLog() {
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '{}');
    const minuteHistory = JSON.parse(localStorage.getItem('scoreMinuteHistory') || '{}');
    const logContainer = document.getElementById('scoreLogContainer');
    
    console.log('🔍 Loading score change log...', { 
        scoreHistoryKeys: Object.keys(scoreHistory),
        scoreHistoryLength: Object.keys(scoreHistory).length,
        minuteHistoryKeys: Object.keys(minuteHistory),
        minuteHistoryLength: Object.keys(minuteHistory).length,
        logContainer: logContainer ? 'found' : 'not found'
    });
    
    if (!logContainer) {
        console.log('❌ Score log container not found');
        return;
    }
    
    // Use minute history if available, otherwise fall back to hour history
    const historyToUse = Object.keys(minuteHistory).length > 0 ? minuteHistory : scoreHistory;
    const historyType = Object.keys(minuteHistory).length > 0 ? 'minute' : 'hour';
    
    console.log('📊 Using history type:', historyType);
    console.log('📊 History data:', historyToUse);
    
    if (Object.keys(historyToUse).length === 0) {
        console.log('📊 No score history found, showing placeholder');
        logContainer.innerHTML = `
            <div class="no-log-data">
                <div class="no-data-icon">📊</div>
                <h3>No Score Changes Yet</h3>
                <p>Your independence score hasn't changed yet. Start tracking finances to see changes here.</p>
            </div>
        `;
        return;
    }
    
    if (Object.keys(historyToUse).length === 1) {
        console.log('⚠️ Only one history entry found, cannot calculate changes');
        logContainer.innerHTML = `
            <div class="no-log-data">
                <div class="no-data-icon">📊</div>
                <h3>Initial Score Recorded</h3>
                <p>Your independence score has been recorded. Make changes to see updates here.</p>
            </div>
        `;
        return;
    }
    
    const sortedTimestamps = Object.keys(historyToUse).sort();
    const logEntries = [];
    
    console.log(`📅 Processing ${historyType}s:`, sortedTimestamps);
    
    // Get the last 5 score changes for dashboard display
    for (let i = 1; i < sortedTimestamps.length; i++) {
        const currentTimestamp = sortedTimestamps[i];
        const previousTimestamp = sortedTimestamps[i - 1];
        const currentScore = historyToUse[currentTimestamp];
        const previousScore = historyToUse[previousTimestamp];
        const change = currentScore - previousScore;
        
        console.log(`🔄 ${historyType} ${i}: ${previousTimestamp} (${previousScore}) → ${currentTimestamp} (${currentScore}) = ${change}`);
        
        if (change !== 0) {
            const changeReason = getScoreChangeReason(change, currentTimestamp, previousTimestamp);
            logEntries.push({
                timestamp: currentTimestamp,
                score: currentScore,
                change: change,
                reason: changeReason
            });
        }
    }
    
    console.log('📝 Final log entries:', logEntries);
    
    // Show only the last 5 changes on dashboard
    const recentEntries = logEntries.slice(-5);
    renderDashboardScoreLog(recentEntries);
}

// Render score log entries for dashboard (compact view)
function renderDashboardScoreLog(logEntries) {
    const logContainer = document.getElementById('scoreLogContainer');
    
    if (logEntries.length === 0) {
        logContainer.innerHTML = `
            <div class="no-log-data">
                <div class="no-data-icon">📊</div>
                <h3>No Score Changes Yet</h3>
                <p>Your independence score hasn't changed yet. Start tracking finances to see changes here.</p>
            </div>
        `;
        return;
    }
    
    const logHTML = logEntries.reverse().map(entry => {
        try {
            const date = new Date(entry.timestamp);
            let timeString;
            
            // Handle both hour and minute format timestamps
            if (entry.timestamp.includes(':')) {
                // Minute format: YYYY-MM-DDTHH:MM
                timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                // Hour format: YYYY-MM-DDTHH
                timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
            const changeClass = entry.change > 0 ? 'positive' : 'negative';
            const changeIcon = entry.change > 0 ? '📈' : '📉';
            
            return `
                <div class="log-entry ${changeClass}">
                    <div class="log-header-row">
                        <div class="log-time">${timeString}</div>
                        <div class="log-score">
                            <span class="score-before">${entry.score - entry.change}</span>
                            <span class="score-arrow">→</span>
                            <span class="score-after">${entry.score}</span>
                        </div>
                        <div class="log-change ${changeClass}">
                            ${changeIcon} ${entry.change > 0 ? '+' : ''}${entry.change}
                        </div>
                    </div>
                    <div class="log-reason">
                        <strong>Reason:</strong> ${entry.reason}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering log entry:', error, entry);
            return '';
        }
    }).join('');
    
    logContainer.innerHTML = logHTML;
}

// Get the reason why the score changed
function getScoreChangeReason(change, currentHour, previousHour) {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        
        console.log('🔍 Getting score change reason:', { change, currentHour, previousHour });
        
        // Validate timestamp parameters
        if (!currentHour || !previousHour) {
            console.log('⚠️ Missing timestamp parameters, using generic reason');
            return change > 0 ? "Score increased" : "Score decreased";
        }
        
        // Check for recent transactions
        const recentTransactions = transactions.filter(t => {
            try {
                if (!t.timestamp) return false;
                const txTime = new Date(t.timestamp);
                const hourTime = new Date(currentHour);
                
                // Check if dates are valid
                if (isNaN(txTime.getTime()) || isNaN(hourTime.getTime())) {
                    console.log('⚠️ Invalid date in transaction or hour:', { txTime, hourTime });
                    return false;
                }
                
                const diffHours = Math.abs(txTime - hourTime) / (1000 * 60 * 60);
                return diffHours <= 1;
            } catch (error) {
                console.log('Error processing transaction timestamp:', error);
                return false;
            }
        });
        
        console.log('📊 Recent transactions found:', recentTransactions.length);
        
        // Build a comprehensive reason based on multiple factors
        let reasons = [];
        
        // Check for recent transactions
        if (recentTransactions.length > 0) {
            const income = recentTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expenses = recentTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            
            if (income > 0) {
                reasons.push(`Income added: $${income.toFixed(2)}`);
            }
            if (expenses > 0) {
                reasons.push(`Expense added: $${expenses.toFixed(2)}`);
            }
        }
        
        // Check for score decay (inactivity)
        const lastTransactionDate = transactions.length > 0 ? 
            Math.max(...transactions.map(t => new Date(t.timestamp).getTime())) : 0;
        const daysSinceLastActivity = (Date.now() - lastTransactionDate) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastActivity > 7) {
            reasons.push(`Inactivity penalty: -5 points`);
        }
        if (daysSinceLastActivity > 14) {
            reasons.push(`Extended inactivity: -10 points`);
        }
        if (daysSinceLastActivity > 30) {
            reasons.push(`Long-term inactivity: -20 points`);
        }
        
        // If we have specific reasons, use them
        if (reasons.length > 0) {
            return reasons.join(' | ');
        }
        
        // Generic reasons based on score change
        if (change > 0) {
            return "Score increased due to improved financial behavior";
        } else {
            return "Score decreased due to financial activity";
        }
        
    } catch (error) {
        console.error('Error in getScoreChangeReason:', error);
        return change > 0 ? "Score increased" : "Score decreased";
    }
}
  