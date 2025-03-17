import { Expense } from '../store/expenseStore';

// Simple linear regression for expense prediction
export const predictExpenseForNextMonth = (expenses: Expense[], category?: string): number => {
  // Filter by category if provided
  const filteredExpenses = category 
    ? expenses.filter(expense => expense.category === category)
    : expenses;
  
  // Group expenses by month
  const expensesByMonth: Record<string, number> = {};
  
  filteredExpenses.forEach(expense => {
    const month = expense.date.substring(0, 7); // YYYY-MM format
    expensesByMonth[month] = (expensesByMonth[month] || 0) + expense.amount;
  });
  
  // Convert to array of [month, amount] pairs and sort by month
  const monthlyData = Object.entries(expensesByMonth)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Need at least 2 months of data for prediction
  if (monthlyData.length < 2) {
    // Return average if we have at least one month
    if (monthlyData.length === 1) {
      return monthlyData[0].amount;
    }
    return 0;
  }
  
  // Simple linear regression
  const n = monthlyData.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = monthlyData.map(data => data.amount);
  
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumXX = x.reduce((acc, val) => acc + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict next month
  const nextMonth = n + 1;
  const prediction = intercept + slope * nextMonth;
  
  // Ensure prediction is not negative
  return Math.max(0, Math.round(prediction));
};

// Identify spending anomalies
export const identifyAnomalies = (expenses: Expense[]): Expense[] => {
  // Group expenses by category
  const expensesByCategory: Record<string, Expense[]> = {};
  
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = [];
    }
    expensesByCategory[expense.category].push(expense);
  });
  
  const anomalies: Expense[] = [];
  
  // For each category, find expenses that are significantly higher than the average
  Object.entries(expensesByCategory).forEach(([category, categoryExpenses]) => {
    if (categoryExpenses.length < 3) return; // Need at least 3 expenses to detect anomalies
    
    const amounts = categoryExpenses.map(expense => expense.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    
    // Calculate standard deviation
    const squaredDifferences = amounts.map(amount => Math.pow(amount - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    // Find expenses that are more than 2 standard deviations above the mean
    const threshold = mean + 2 * stdDev;
    
    categoryExpenses.forEach(expense => {
      if (expense.amount > threshold) {
        anomalies.push(expense);
      }
    });
  });
  
  return anomalies;
};

// Generate savings tips based on spending patterns
export const generateSavingsTips = (expenses: Expense[]): string[] => {
  const tips: string[] = [];
  
  // Calculate total spent on different categories
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  
  // Sort categories by total amount spent
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
  
  // Generate tips based on top spending categories
  if (sortedCategories.includes('food')) {
    tips.push('Try meal prepping at home to reduce food delivery expenses.');
    tips.push('Consider using apps like Zomato Pro or Swiggy Super for discounts on food delivery.');
  }
  
  if (sortedCategories.includes('transport')) {
    tips.push('Use public transport or carpooling to save on daily commute costs.');
    tips.push('Consider monthly metro passes for regular travel.');
  }
  
  if (sortedCategories.includes('entertainment')) {
    tips.push('Look for free entertainment options like public parks or community events.');
    tips.push('Share OTT subscriptions with family members to reduce costs.');
  }
  
  if (sortedCategories.includes('shopping')) {
    tips.push('Wait for seasonal sales to make big purchases.');
    tips.push('Use cashback apps and credit card rewards for shopping.');
  }
  
  if (sortedCategories.includes('utilities')) {
    tips.push('Switch off appliances when not in use to save on electricity bills.');
    tips.push('Consider installing energy-efficient LED bulbs.');
  }
  
  // Add general tips if we don't have enough category-specific ones
  if (tips.length < 3) {
    tips.push('Set up automatic transfers to a savings account on payday.');
    tips.push('Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.');
    tips.push('Consider investing in PPF or FD for tax savings under Section 80C.');
    tips.push('Use UPI for payments to track expenses easily and earn cashback rewards.');
  }
  
  // Return random selection of tips (max 3)
  return tips.sort(() => 0.5 - Math.random()).slice(0, 3);
};