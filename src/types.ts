export interface Question {
  id: string;
  text: string;
  category: string;
  placeholder: string;
}

export interface AppIdea {
  [key: string]: string;
}

export interface SavedSession {
  id: string;
  title: string;
  timestamp: number;
  appIdea: AppIdea;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  messages: ChatMessage[];
}
