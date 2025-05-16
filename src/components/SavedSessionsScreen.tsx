import React, { useState } from 'react';
import { ArrowLeft, Trash2, ExternalLink, Copy, Search, Calendar, Clock } from 'lucide-react';
import { SavedSession } from '../types';

interface SavedSessionsScreenProps {
  sessions: SavedSession[];
  onLoad: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onFork: (sessionId: string) => void;
  onBack: () => void;
}

const SavedSessionsScreen: React.FC<SavedSessionsScreenProps> = ({
  sessions,
  onLoad,
  onDelete,
  onFork,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter sessions based on search term
  const filteredSessions = sessions
    .filter(session => 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(session.appIdea).some(value => 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

  const handleDeleteClick = (sessionId: string) => {
    if (confirmDelete === sessionId) {
      onDelete(sessionId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(sessionId);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Saved Ideas</h1>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search your ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No saved ideas found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try a different search term' : 'Start brainstorming to create some ideas!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSessions.map(session => (
            <div 
              key={session.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{session.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-3">{formatDate(session.timestamp)}</span>
                  <Clock size={14} className="mr-1" />
                  <span>{formatTime(session.timestamp)}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {session.appIdea.problem ? 
                    `Solves: ${session.appIdea.problem}` : 
                    'No problem statement defined'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(session.appIdea)
                  .filter(([key, value]) => value && key !== 'problem')
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <span 
                      key={key} 
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-sm"
                    >
                      {key}: {value.substring(0, 20)}{value.length > 20 ? '...' : ''}
                    </span>
                  ))}
                {Object.keys(session.appIdea).length > 4 && (
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-sm">
                    +{Object.keys(session.appIdea).length - 4} more
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLoad(session.id)}
                  className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <ExternalLink size={16} />
                  Open
                </button>
                
                <button
                  onClick={() => onFork(session.id)}
                  className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Copy size={16} />
                  Fork & Extend
                </button>
                
                <button
                  onClick={() => handleDeleteClick(session.id)}
                  className={`flex items-center gap-1 ${
                    confirmDelete === session.id 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-300'
                  } px-3 py-1.5 rounded-lg text-sm font-medium transition-colors`}
                >
                  <Trash2 size={16} />
                  {confirmDelete === session.id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSessionsScreen;
