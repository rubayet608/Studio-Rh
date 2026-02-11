

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatar?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  systemPrompt?: string;
}

export interface Settings {
  model: string;
  theme: Theme;
  systemPrompt: string;
}

export interface ImageResult {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface VoiceResult {
  url: string;
  text: string;
  voice: string;
  timestamp: number;
}