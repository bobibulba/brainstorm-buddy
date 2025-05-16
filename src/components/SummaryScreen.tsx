import React, { useState, useEffect } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Lightbulb, Save, BookOpen, MessageCircle } from 'lucide-react';
import { AppIdea } from '../types';

interface SummaryScreenProps {
  appIdea: AppIdea;
  onRestart: () => void;
  onSave: (title: string) => string;
  sessionId: string | null;
  onViewSaved: () => void;
  onStartChat: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ 
  appIdea, 
  onRestart, 
  onSave, 
  sessionId,
  onViewSaved,
  onStartChat
}) => {
  const [copied, setCopied] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate a default title based on the app idea
  useEffect(() => {
    if (!sessionTitle && appIdea.problem) {
      const defaultTitle = `App for ${appIdea.problem.split(' ').slice(0, 3).join(' ')}...`;
      setSessionTitle(defaultTitle);
    }
  }, [appIdea, sessionTitle]);

  // Generate summary from app idea
  const generateSummary = () => {
    const problem = appIdea.problem || 'Not specified';
    const audience = appIdea.audience || 'Not specified';
    const benefit = appIdea.benefit || 'Not specified';
    const features = appIdea.features || 'Not specified';
    
    return `Your app aims to solve the problem of ${problem.toLowerCase()} for ${audience.toLowerCase()}. 
    The main benefit is that it ${benefit.toLowerCase()}. 
    Key features include ${features.toLowerCase()}.`;
  };

  // Generate prompt for ChatAndBuild
  const generatePrompt = () => {
    const problem = appIdea.problem ? `that solves ${appIdea.problem}` : '';
    const audience = appIdea.audience ? `for ${appIdea.audience}` : '';
    const features = appIdea.features ? `with features like ${appIdea.features}` : '';
    
    return `Create an app ${problem} ${audience} ${features}`.trim();
  };

  // Generate AI suggestions based on the app idea
  useEffect(() => {
    const generateAiSuggestions = () => {
      setIsLoadingSuggestions(true);
      
      // Simulate AI processing with timeout
      setTimeout(() => {
        // Generate contextual suggestions based on the app idea
        const suggestions = generateContextualSuggestions();
        setAiSuggestions(suggestions);
        setIsLoadingSuggestions(false);
      }, 1500);
    };

    if (Object.keys(appIdea).length > 0) {
      generateAiSuggestions();
    }
  }, [appIdea]);

  // Generate contextual suggestions based on the app idea
  const generateContextualSuggestions = () => {
    const problem = appIdea.problem || '';
    const audience = appIdea.audience || '';
    const benefit = appIdea.benefit || '';
    const features = appIdea.features || '';
    const uniqueness = appIdea.uniqueness || '';
    const goal = appIdea.goal || '';
    const monetization = appIdea.monetization || '';
    const challenges = appIdea.challenges || '';
    
    const suggestions: string[] = [];
    
    // Feature suggestions based on audience and problem
    if (audience && problem) {
      suggestions.push(`Consider adding a community feature where ${audience} can share their experiences with ${problem} and support each other.`);
    }
    
    // Integration suggestions based on features
    if (features) {
      suggestions.push(`You might want to explore integrating with existing services that complement your ${features} to provide a more comprehensive solution.`);
    }
    
    // Analytics suggestion based on benefit
    if (benefit) {
      suggestions.push(`Adding analytics to track how users experience the benefit of "${benefit}" could provide valuable insights for future improvements.`);
    }
    
    // Monetization suggestion based on monetization strategy or audience
    if (monetization) {
      suggestions.push(`Your monetization approach of "${monetization}" could be enhanced by offering tiered pricing based on usage levels or feature access.`);
    } else if (audience) {
      suggestions.push(`Based on your target audience of ${audience}, a subscription model with a free tier might be an effective monetization strategy.`);
    }
    
    // Challenge-related suggestion
    if (challenges) {
      suggestions.push(`To address the challenge of "${challenges}", consider implementing a phased rollout strategy and gathering early user feedback.`);
    } else {
      suggestions.push(`A common challenge for apps in this space is user retention. Consider implementing engagement features like achievements or progress tracking.`);
    }
    
    // Uniqueness-related suggestion
    if (uniqueness) {
      suggestions.push(`Your unique approach of "${uniqueness}" could be highlighted in your marketing to differentiate from competitors.`);
    }
    
    // Goal-related suggestion
    if (goal) {
      suggestions.push(`To achieve your goal of "${goal}", consider creating measurable milestones and tracking your progress against them.`);
    }
    
    // If we don't have enough suggestions, add some generic ones
    if (suggestions.length < 5) {
      suggestions.push(
        "Consider creating a simple prototype or MVP to test your core assumptions before building the full app.",
        "User onboarding is critical - design a simple, engaging first-time user experience that showcases your app's value.",
        "Think about how your app will evolve over time. What features might you add in version 2.0?",
        "Research shows that apps with regular updates retain users better. Plan for a consistent update schedule.",
        "Consider how you'll gather and incorporate user feedback from the beginning."
      );
    }
    
    // Return 5 suggestions (or fewer if we couldn't generate that many)
    return suggestions.slice(0, 5);
  };

  const summary = generateSummary();
  const prompt = generatePrompt();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsPDF = () => {
    alert('PDF download functionality would be implemented here');
    // In a real implementation, we would use a library like jspdf to generate a PDF
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My App Idea',
        text: summary + '\n\nPrompt for ChatAndBuild: ' + prompt,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      alert('Web Share API not supported in your browser');
    }
  };

  const handleSaveSession = () => {
    if (!sessionTitle.trim()) {
      alert('Please enter a title for your session');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      onSave(sessionTitle);
      setSaveSuccess(true);
      setIsSaving(false);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
          <Sparkles size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Your App Idea Summary</h1>
        <p className="text-gray-600 dark:text-gray-300">Here's a summary of your app idea based on your answers</p>
      </div>

      {/* Chat with AI Button */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageCircle className="mr-2" size={24} />
            <h2 className="text-xl font-semibold">Chat with AI about your idea</h2>
          </div>
        </div>
        <p className="mb-4">
          Explore your app idea further with our AI assistant. Get feedback, brainstorm features, discuss challenges, and refine your concept.
        </p>
        <button
          onClick={onStartChat}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
        >
          <Sparkles size={18} className="mr-2" />
          Start AI Brainstorming
        </button>
      </div>

      {/* Save Session UI */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Save Your Idea</h2>
          {saveSuccess && (
            <span className="text-green-500 text-sm font-medium">✓ Saved successfully!</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="Enter a title for your app idea"
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {sessionId ? 'Update' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">App Description</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
          {summary}
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">ChatAndBuild Prompt</h2>
          <div className="relative">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-gray-800 dark:text-gray-200 mb-2">
              {prompt}
            </div>
            <button 
              onClick={handleCopyPrompt}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 p-2 rounded-md transition-colors"
              aria-label="Copy prompt"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Lightbulb className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Brainstorming Suggestions</h2>
        </div>
        
        {isLoadingSuggestions ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Generating suggestions...</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-200 border-l-4 border-indigo-500">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(appIdea).map(([key, value]) => (
          value && (
            <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{key}</h3>
              <p className="text-gray-800 dark:text-white">{value}</p>
            </div>
          )
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-auto">
        <button
          onClick={handleSaveAsPDF}
          className="flex items-center gap-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          <Download size={18} />
          Save as PDF
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
        
        <button
          onClick={onViewSaved}
          className="flex items-center gap-2 border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium py-2 px-6 rounded-lg transition-colors"
        >
          <BookOpen size={18} />
          View Saved Ideas
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
