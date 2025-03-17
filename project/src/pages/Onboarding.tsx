import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, IndianRupee, PieChart, Bell, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome to RupeeTrack',
      description: 'Your personal expense manager designed for Indian users',
      icon: IndianRupee,
      color: 'bg-primary-600',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Track Your Expenses',
      description: 'Log daily expenses, categorize transactions, and manage your spending habits',
      icon: PieChart,
      color: 'bg-green-600',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Set Budgets & Goals',
      description: 'Create budgets for different categories and set savings goals to achieve financial freedom',
      icon: Target,
      color: 'bg-orange-600',
      image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Never Miss a Bill',
      description: 'Get reminders for upcoming bills, EMIs, and subscriptions',
      icon: Bell,
      color: 'bg-purple-600',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  const currentStep = steps[step];
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="relative h-1/2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={currentStep.image}
                alt={currentStep.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-white bg-black/30 rounded-full"
            >
              Skip
            </button>
          </div>
        </div>
        
        <div className="flex-1 px-6 pt-8 pb-10 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`p-3 rounded-full ${currentStep.color} w-fit mb-4`}>
                <currentStep.icon size={24} className="text-white" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2 dark:text-white">
                {currentStep.title}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300">
                {currentStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div>
            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === step ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center"
            >
              {step < steps.length - 1 ? 'Continue' : 'Get Started'}
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;