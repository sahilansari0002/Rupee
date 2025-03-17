// Using the Web Speech API for voice input
export const startSpeechRecognition = (
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  language: string = 'en-IN'
): (() => void) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition is not supported in this browser.');
    return () => {};
  }

  // @ts-ignore - Using browser API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };

  recognition.start();

  // Return a function to stop listening
  return () => {
    recognition.stop();
  };
};

// Parse expense from voice input
export const parseExpenseFromVoice = (transcript: string): {
  amount?: number;
  description?: string;
  category?: string;
} => {
  const result: { amount?: number; description?: string; category?: string } = {};

  // Try to extract amount
  const amountMatch = transcript.match(/(\d+)/);
  if (amountMatch) {
    result.amount = parseInt(amountMatch[0], 10);
  }

  // Try to extract category based on keywords
  const categoryKeywords: Record<string, string[]> = {
    food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'eating', 'meal', 'khana'],
    groceries: ['groceries', 'grocery', 'vegetables', 'fruits', 'supermarket', 'sabzi', 'kirana'],
    transport: ['transport', 'travel', 'uber', 'ola', 'cab', 'auto', 'rickshaw', 'bus', 'metro', 'train'],
    shopping: ['shopping', 'clothes', 'shoes', 'dress', 'shirt', 'pants', 'kapde'],
    entertainment: ['movie', 'cinema', 'theatre', 'entertainment', 'show', 'concert', 'film'],
    utilities: ['electricity', 'water', 'gas', 'bill', 'utility', 'bijli', 'pani'],
    mobile: ['mobile', 'phone', 'recharge', 'airtel', 'jio', 'vi', 'vodafone'],
    health: ['medicine', 'doctor', 'hospital', 'medical', 'health', 'healthcare', 'clinic', 'dawai'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (transcript.toLowerCase().includes(keyword.toLowerCase())) {
        result.category = category;
        break;
      }
    }
    if (result.category) break;
  }

  // Use the rest as description
  result.description = transcript;

  return result;
};