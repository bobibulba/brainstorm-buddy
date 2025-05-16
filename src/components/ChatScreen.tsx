import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, RefreshCw, Sparkles } from 'lucide-react';
import { AppIdea, ChatMessage } from '../types';

interface ChatScreenProps {
  appIdea: AppIdea;
  onBack: () => void;
  initialMessages?: ChatMessage[];
  onSaveMessages: (messages: ChatMessage[]) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ 
  appIdea, 
  onBack, 
  initialMessages = [],
  onSaveMessages
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate initial AI message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: generateInitialMessage(),
        timestamp: Date.now()
      };
      setMessages([initialMessage]);
    }
  }, []);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      onSaveMessages(messages);
    }
  }, [messages, onSaveMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate initial message based on app idea
  const generateInitialMessage = () => {
    const problem = appIdea.problem || 'your problem';
    const audience = appIdea.audience || 'your audience';
    const features = appIdea.features || 'key features';
    
    return `Hi there! I'm your AI brainstorming assistant. I've reviewed your app idea about solving ${problem} for ${audience}. Let's explore this further! You can ask me about:

1. How to refine your value proposition
2. Ideas for additional features beyond ${features}
3. Potential challenges and how to overcome them
4. Market research suggestions
5. Technical implementation considerations

What aspect of your app idea would you like to discuss first?`;
  };

  // Generate AI response based on user message and app idea context
  const generateAIResponse = (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate AI processing time
      setTimeout(() => {
        // Extract key information from app idea for context
        const problem = appIdea.problem || 'the problem';
        const audience = appIdea.audience || 'the target audience';
        const benefit = appIdea.benefit || 'the main benefit';
        const features = appIdea.features || 'the features';
        const uniqueness = appIdea.uniqueness || 'unique aspects';
        const monetization = appIdea.monetization || 'monetization strategy';
        
        // Simple keyword matching to generate contextual responses
        const lowerCaseMessage = userMessage.toLowerCase();
        
        if (lowerCaseMessage.includes('feature') || lowerCaseMessage.includes('functionality')) {
          return resolve(`Based on your goal to solve ${problem} for ${audience}, here are some additional feature ideas:

1. A personalized dashboard that tracks user progress and engagement
2. Integration with existing tools that ${audience} already uses
3. Community features where users can share their experiences
4. Analytics to help users understand how they're benefiting
5. Customizable notifications based on user preferences

Which of these features resonates most with your vision?`);
        }
        
        if (lowerCaseMessage.includes('monetiz') || lowerCaseMessage.includes('revenue') || lowerCaseMessage.includes('business')) {
          return resolve(`For monetizing an app that ${benefit}, you have several options:

1. Freemium model: Basic features free, premium features paid
2. Subscription tiers: Different levels of access at different price points
3. One-time purchase with optional add-ons
4. Partnership with businesses that serve ${audience}
5. In-app purchases for enhanced functionality

Your current thinking about ${monetization} is a good starting point. Would you like to explore any of these alternatives in more depth?`);
        }
        
        if (lowerCaseMessage.includes('challenge') || lowerCaseMessage.includes('problem') || lowerCaseMessage.includes('issue')) {
          return resolve(`When building an app for ${audience} that addresses ${problem}, you might face these challenges:

1. User acquisition and retention
2. Differentiating from competitors who also offer ${uniqueness}
3. Technical implementation of ${features}
4. Scaling as your user base grows
5. Keeping the app engaging over time

Which of these concerns you most, and would you like to brainstorm solutions?`);
        }
        
        if (lowerCaseMessage.includes('market') || lowerCaseMessage.includes('competitor') || lowerCaseMessage.includes('research')) {
          return resolve(`To better understand the market for an app that ${benefit} for ${audience}, consider:

1. Conducting user interviews with potential customers
2. Analyzing competitors who also address ${problem}
3. Testing a simple landing page to gauge interest
4. Joining communities where ${audience} gathers
5. Creating a simple prototype to get early feedback

This research will help refine your unique value proposition around ${uniqueness}. What research method seems most feasible to start with?`);
        }
        
        // Default response if no keywords match
        return resolve(`Thanks for sharing your thoughts about ${problem}. To further develop your app idea:

1. Consider how you might enhance ${features} to better deliver ${benefit}
2. Think about how your approach to ${uniqueness} truly sets you apart
3. Explore different ways to connect with ${audience}
4. Test assumptions about how users will engage with your solution

What specific aspect of your app would you like to explore next?`);
      }, 1500);
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(input);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea as content grows
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800 dark:text-white">AI Brainstorming Chat</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Exploring your app idea</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div 
                  className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-indigo-200' 
                      : 'text-gray-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto flex items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none max-h-32 min-h-[2.5rem]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
