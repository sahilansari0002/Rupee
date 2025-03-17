import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { useExpenseStore } from '../store/expenseStore';

export const formatCurrency = (amount: number): string => {
  const { currency } = useExpenseStore.getState();
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === '₹' ? 'INR' : currency === '$' ? 'USD' : currency === '€' ? 'EUR' : 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string, short = false): string => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  if (short) {
    if (isThisWeek(date)) {
      return format(date, 'EEE');
    }
    
    if (isThisMonth(date)) {
      return format(date, 'd MMM');
    }
    
    if (isThisYear(date)) {
      return format(date, 'd MMM');
    }
    
    return format(date, 'd MMM yy');
  }
  
  return format(date, 'd MMMM yyyy');
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateString);
};