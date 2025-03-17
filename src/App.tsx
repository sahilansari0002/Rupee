import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseList from './pages/ExpenseList';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

// Components
import BottomNavigation from './components/BottomNavigation';
import SplashScreen from './components/SplashScreen';

// Store
import { useThemeStore } from './store/themeStore';

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const { theme, initTheme } = useThemeStore();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Initialize theme
    initTheme();
    
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [initTheme]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Display a message about PWA functionality on StackBlitz
  useEffect(() => {
    if (window.location.hostname.includes('stackblitz')) {
      console.log('Note: PWA functionality is limited on StackBlitz. For full PWA features, deploy to a production environment.');
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isFirstVisit) {
    return <Onboarding onComplete={() => setIsFirstVisit(false)} />;
  }

  const showBottomNav = !['/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<Onboarding onComplete={() => setIsFirstVisit(false)} />} />
        </Routes>
      </AnimatePresence>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}

export default App;