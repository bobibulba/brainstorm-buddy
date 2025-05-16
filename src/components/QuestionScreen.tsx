import React, { useState, useEffect } from 'react';
import { ChevronRight, SkipForward, ChevronDown, ChevronUp } from 'lucide-react';
import { Question, AppIdea } from '../types';

interface QuestionScreenProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  appIdea: AppIdea;
  onNext: (id: string, answer: string) => void;
  onSkip: () => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentStep,
  totalSteps,
  appIdea,
  onNext,
  onSkip
}) => {
  const [answer, setAnswer] = useState('');
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  // Clear answer when question changes
  useEffect(() => {
    setAnswer(appIdea[question.id] || '');
  }, [question.id, appIdea]);

  const handleNext = () => {
    onNext(question.id, answer);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Category toggle */}
      <button 
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
      >
        <div className="flex items-center">
          <div className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></div>
          <span className="font-medium text-gray-700 dark:text-gray-200">{question.category}</span>
        </div>
        {isCategoryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Question */}
      {isCategoryExpanded && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{question.text}</h2>
          
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg h-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none transition-all duration-200"
          />

          {/* Skip instruction - moved from welcome page */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
            Not sure about this question? Feel free to skip it!
          </p>

          <div className="flex justify-between mt-6">
            <button
              onClick={onSkip}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <SkipForward size={18} />
              Skip
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-200 hover:shadow-md"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
