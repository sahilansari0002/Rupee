import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { startSpeechRecognition, parseExpenseFromVoice } from '../utils/speechRecognition';

interface VoiceInputProps {
  onResult: (result: { amount?: number; description?: string; category?: string }) => void;
  language?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, language = 'en-IN' }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  
  const handleStartListening = () => {
    setIsListening(true);
    setError(null);
    setTranscript(null);
    
    const stopListening = startSpeechRecognition(
      (text) => {
        setTranscript(text);
        const parsedExpense = parseExpenseFromVoice(text);
        onResult(parsedExpense);
        setIsListening(false);
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      },
      language
    );
    
    // Stop listening after 10 seconds if no result
    setTimeout(() => {
      if (isListening) {
        stopListening();
        setIsListening(false);
        setError('Listening timeout. Please try again.');
      }
    }, 10000);
  };
  
  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleStartListening}
        disabled={isListening}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
          isListening ? 'bg-danger-500' : 'bg-primary-600'
        }`}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff size={24} className="text-white" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary-300"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 text-center"
          >
            <div className="flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Loader2 size={16} className="animate-spin mr-2" />
              <span>Listening...</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Speak clearly to add your expense
            </p>
          </motion.div>
        )}
        
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">
              "{transcript}"
            </p>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-danger-600 dark:text-danger-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInput;