import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, BookOpen, Plus } from 'lucide-react';
import { SavedSession } from '../types';

interface StartScreenProps {
  onStart: () => void;
  onViewSaved: () => void;
  onLoadSession: (sessionId: string) => void;
  hasSavedSessions: boolean;
  recentSessions: SavedSession[];
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  onViewSaved, 
  onLoadSession,
  hasSavedSessions, 
  recentSessions 
}) => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: '', author: '' });

  const quotes = [
    { text: "Ideas are the beginning points of all fortunes.", author: "Napoleon Hill" },
    { text: "The best way to have a good idea is to have lots of ideas.", author: "Linus Pauling" },
    { text: "Ideas are worthless until you get them out of your head to see what they can do.", author: "Tanner Christensen" },
    { text: "If you have an apple and I have an apple and we exchange these apples then you and I will still each have one apple. But if you have an idea and I have an idea and we exchange these ideas, then each of us will have two ideas.", author: "George Bernard Shaw" },
    { text: "Ideas are like rabbits. You get a couple and learn how to handle them, and pretty soon you have a dozen.", author: "John Steinbeck" },
    { text: "An idea that is not dangerous is unworthy of being called an idea at all.", author: "Oscar Wilde" },
    { text: "Ideas are commodity. Execution of them is not.", author: "Michael Dell" },
    { text: "No idea is so outlandish that it should not be considered.", author: "Winston Churchill" },
    { text: "The air is full of ideas. They are knocking you in the head all the time. You only have to know what you want, then forget it, and go about your business. Suddenly, the idea will come through. It was there all the time.", author: "Henry Ford" },
    { text: "One idea lights a thousand candles.", author: "Ralph Waldo Emerson" }
  ];

  useEffect(() => {
    // Select a random quote when component mounts
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-8 shadow-lg">
        <Brain size={40} className="text-white" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent text-center">
        BrainstormBuddy
      </h1>
      
      {/* Quote Section */}
      <div className="max-w-md text-center mb-8 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300 italic">"{quote.text}"</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">— {quote.author}</p>
      </div>
      
      <div className="w-full max-w-2xl">
        {/* Start New Session Button */}
        <button 
          onClick={onStart}
          className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg w-full mb-6"
        >
          <Plus size={20} />
          Start New Brainstorming Session
          <ArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-1" size={20} />
        </button>
        
        {/* Recent Sessions Section */}
        {hasSavedSessions && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Ideas</h2>
              <button 
                onClick={onViewSaved}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentSessions.slice(0, 3).map(session => (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => onLoadSession(session.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white line-clamp-1">{session.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
                      {session.appIdea.problem || 'No problem statement'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {formatDate(session.timestamp)}
                  </span>
                </div>
              ))}
              
              {recentSessions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-2">
                  No saved ideas yet. Start brainstorming!
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* View All Saved Sessions Button */}
        {hasSavedSessions && (
          <button 
            onClick={onViewSaved}
            className="group flex items-center justify-center gap-2 border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full"
          >
            <BookOpen size={20} />
            Browse All Saved Ideas
          </button>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
