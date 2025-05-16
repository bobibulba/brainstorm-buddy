import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import SummaryScreen from './components/SummaryScreen';
import ThemeToggle from './components/ThemeToggle';
import SavedSessionsScreen from './components/SavedSessionsScreen';
import ChatScreen from './components/ChatScreen';
import { questions } from './data/questions';
import { AppIdea, SavedSession, ChatMessage } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'questions' | 'summary' | 'saved' | 'chat'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [appIdea, setAppIdea] = useState<AppIdea>({});
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Load saved sessions from localStorage
  useEffect(() => {
    const savedSessionsData = localStorage.getItem('brainstormBuddySessions');
    if (savedSessionsData) {
      setSavedSessions(JSON.parse(savedSessionsData));
    } else {
      // Try to load from old key for backward compatibility
      const oldSavedSessionsData = localStorage.getItem('savedSessions');
      if (oldSavedSessionsData) {
        const sessions = JSON.parse(oldSavedSessionsData);
        setSavedSessions(sessions);
        // Save to new key
        localStorage.setItem('brainstormBuddySessions', JSON.stringify(sessions));
      }
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('brainstormBuddySessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleStart = () => {
    setCurrentScreen('questions');
    setCurrentSessionId(null);
    setAppIdea({});
    setCurrentQuestionIndex(0);
    setChatMessages([]);
  };

  const handleViewSavedSessions = () => {
    setCurrentScreen('saved');
  };

  const handleNext = (id: string, answer: string) => {
    // Save the answer
    setAppIdea(prev => ({
      ...prev,
      [id]: answer
    }));

    // Move to next question or summary
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentScreen('summary');
    }
  };

  const handleSkip = () => {
    // Move to next question without saving an answer
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentScreen('summary');
    }
  };

  const handleRestart = () => {
    setAppIdea({});
    setCurrentQuestionIndex(0);
    setCurrentSessionId(null);
    setChatMessages([]);
    setCurrentScreen('start');
  };

  const handleSaveSession = (title: string) => {
    const newSession: SavedSession = {
      id: currentSessionId || `session-${Date.now()}`,
      title,
      timestamp: Date.now(),
      appIdea: { ...appIdea }
    };

    if (currentSessionId) {
      // Update existing session
      setSavedSessions(prev => 
        prev.map(session => session.id === currentSessionId ? newSession : session)
      );
    } else {
      // Add new session
      setSavedSessions(prev => [...prev, newSession]);
    }

    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const handleLoadSession = (sessionId: string) => {
    const session = savedSessions.find(s => s.id === sessionId);
    if (session) {
      setAppIdea(session.appIdea);
      setCurrentSessionId(session.id);
      setChatMessages([]); // Reset chat messages when loading a session
      setCurrentScreen('summary');
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSavedSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  const handleForkSession = (sessionId: string) => {
    const session = savedSessions.find(s => s.id === sessionId);
    if (session) {
      setAppIdea(session.appIdea);
      setCurrentSessionId(null); // Create a new session based on the forked one
      setChatMessages([]); // Reset chat messages when forking a session
      setCurrentScreen('summary');
    }
  };

  const handleStartChat = () => {
    setCurrentScreen('chat');
  };

  const handleBackToSummary = () => {
    setCurrentScreen('summary');
  };

  const handleSaveChatMessages = (messages: ChatMessage[]) => {
    setChatMessages(messages);
  };

  // Get recent sessions sorted by timestamp (newest first)
  const recentSessions = [...savedSessions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      {currentScreen === 'start' && (
        <StartScreen 
          onStart={handleStart} 
          onViewSaved={handleViewSavedSessions}
          onLoadSession={handleLoadSession}
          hasSavedSessions={savedSessions.length > 0}
          recentSessions={recentSessions}
        />
      )}
      
      {currentScreen === 'questions' && (
        <QuestionScreen
          question={questions[currentQuestionIndex]}
          currentStep={currentQuestionIndex + 1}
          totalSteps={questions.length}
          appIdea={appIdea}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      )}
      
      {currentScreen === 'summary' && (
        <SummaryScreen 
          appIdea={appIdea} 
          onRestart={handleRestart}
          onSave={handleSaveSession}
          sessionId={currentSessionId}
          onViewSaved={handleViewSavedSessions}
          onStartChat={handleStartChat}
        />
      )}

      {currentScreen === 'saved' && (
        <SavedSessionsScreen 
          sessions={savedSessions}
          onLoad={handleLoadSession}
          onDelete={handleDeleteSession}
          onFork={handleForkSession}
          onBack={() => setCurrentScreen('start')}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen 
          appIdea={appIdea}
          onBack={handleBackToSummary}
          initialMessages={chatMessages}
          onSaveMessages={handleSaveChatMessages}
        />
      )}
    </div>
  );
}

export default App;
