import {
  ShoppingBag, Utensils, Home, Bus, Briefcase, Heart, Smartphone, 
  BookOpen, Gift, Coffee, Film, Zap, Droplet, Wifi, Tv, CreditCard,
  DollarSign, Landmark, Umbrella, Scissors, Truck, Headphones
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  nameHi?: string; // Hindi name
}

export const expenseCategories: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    nameHi: 'किराना सामान',
    icon: ShoppingBag,
    color: 'text-green-500',
  },
  {
    id: 'food',
    name: 'Food & Dining',
    nameHi: 'खाना और भोजन',
    icon: Utensils,
    color: 'text-orange-500',
  },
  {
    id: 'housing',
    name: 'Rent & Housing',
    nameHi: 'किराया और आवास',
    icon: Home,
    color: 'text-blue-500',
  },
  {
    id: 'transport',
    name: 'Transport',
    nameHi: 'परिवहन',
    icon: Bus,
    color: 'text-purple-500',
  },
  {
    id: 'auto',
    name: 'Auto Rickshaw',
    nameHi: 'ऑटो रिक्शा',
    icon: Truck,
    color: 'text-yellow-500',
  },
  {
    id: 'work',
    name: 'Work Expenses',
    nameHi: 'काम का खर्च',
    icon: Briefcase,
    color: 'text-gray-500',
  },
  {
    id: 'health',
    name: 'Healthcare',
    nameHi: 'स्वास्थ्य देखभाल',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    id: 'mobile',
    name: 'Mobile Recharge',
    nameHi: 'मोबाइल रिचार्ज',
    icon: Smartphone,
    color: 'text-indigo-500',
  },
  {
    id: 'education',
    name: 'Education',
    nameHi: 'शिक्षा',
    icon: BookOpen,
    color: 'text-teal-500',
  },
  {
    id: 'gifts',
    name: 'Gifts & Donations',
    nameHi: 'उपहार और दान',
    icon: Gift,
    color: 'text-pink-500',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameHi: 'मनोरंजन',
    icon: Film,
    color: 'text-violet-500',
  },
  {
    id: 'utilities',
    name: 'Electricity Bill',
    nameHi: 'बिजली का बिल',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    id: 'water',
    name: 'Water Bill',
    nameHi: 'पानी का बिल',
    icon: Droplet,
    color: 'text-blue-400',
  },
  {
    id: 'internet',
    name: 'Internet & WiFi',
    nameHi: 'इंटरनेट और वाईफाई',
    icon: Wifi,
    color: 'text-cyan-500',
  },
  {
    id: 'dth',
    name: 'DTH Recharge',
    nameHi: 'डीटीएच रिचार्ज',
    icon: Tv,
    color: 'text-amber-500',
  },
  {
    id: 'emi',
    name: 'EMI Payments',
    nameHi: 'ईएमआई भुगतान',
    icon: CreditCard,
    color: 'text-slate-500',
  },
  {
    id: 'investment',
    name: 'Investments',
    nameHi: 'निवेश',
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  {
    id: 'banking',
    name: 'Banking Charges',
    nameHi: 'बैंकिंग शुल्क',
    icon: Landmark,
    color: 'text-stone-500',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    nameHi: 'बीमा',
    icon: Umbrella,
    color: 'text-sky-500',
  },
  {
    id: 'personal',
    name: 'Personal Care',
    nameHi: 'व्यक्तिगत देखभाल',
    icon: Scissors,
    color: 'text-rose-500',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    nameHi: 'खरीदारी',
    icon: ShoppingBag,
    color: 'text-fuchsia-500',
  },
  {
    id: 'subscription',
    name: 'Subscriptions',
    nameHi: 'सदस्यता',
    icon: Headphones,
    color: 'text-lime-500',
  },
  {
    id: 'other',
    name: 'Other',
    nameHi: 'अन्य',
    icon: Coffee,
    color: 'text-gray-500',
  },
];

export const paymentMethods = [
  { id: 'cash', name: 'Cash', nameHi: 'नकद' },
  { id: 'upi', name: 'UPI', nameHi: 'यूपीआई' },
  { id: 'debit', name: 'Debit Card', nameHi: 'डेबिट कार्ड' },
  { id: 'credit', name: 'Credit Card', nameHi: 'क्रेडिट कार्ड' },
  { id: 'netbanking', name: 'Net Banking', nameHi: 'नेट बैंकिंग' },
  { id: 'wallet', name: 'Mobile Wallet', nameHi: 'मोबाइल वॉलेट' },
];

export const getCategoryById = (id: string): Category => {
  return expenseCategories.find((category) => category.id === id) || expenseCategories[expenseCategories.length - 1];
};

export const getPaymentMethodById = (id: string) => {
  return paymentMethods.find((method) => method.id === id) || paymentMethods[0];
};