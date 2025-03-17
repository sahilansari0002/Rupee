import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useExpenseStore } from '../store/expenseStore';
import { formatCurrency } from '../utils/formatters';
import { getCategoryById } from '../utils/categories';

interface ExpenseChartProps {
  type: 'pie' | 'bar';
  period?: 'week' | 'month' | 'year';
}

const COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1'
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ type, period = 'month' }) => {
  const { expenses, getTotalExpensesByCategory, getTotalExpensesByMonth } = useExpenseStore();
  
  // Prepare data for pie chart
  const preparePieChartData = () => {
    const categoryTotals = getTotalExpensesByCategory();
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: getCategoryById(category).name,
        value: amount,
        color: getCategoryById(category).color.replace('text-', 'bg-').replace('-500', '-400'),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Show top 6 categories
  };
  
  // Prepare data for bar chart
  const prepareBarChartData = () => {
    const monthlyTotals = getTotalExpensesByMonth();
    
    return Object.entries(monthlyTotals)
      .map(([month, amount]) => {
        // Format month for display (e.g., "2023-01" to "Jan")
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        return {
          name: monthName,
          amount,
        };
      })
      .slice(-6); // Show last 6 months
  };
  
  const pieData = preparePieChartData();
  const barData = prepareBarChartData();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary-600 dark:text-primary-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No expense data available</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Add some expenses to see your spending patterns
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-64 w-full">
      {type === 'pie' ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseChart;