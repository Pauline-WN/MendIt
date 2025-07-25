import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveMediation } from './components/LiveMediation';
import { HealingMode } from './components/HealingMode';
import { Archive } from './components/Archive';
import { ConflictQuiz } from './components/ConflictQuiz';
import { getStoredData } from './utils/storage';

export type View = 'mediate' | 'healing' | 'archive' | 'quiz' | 'join-session';

export interface Person {
  name: string;
  statement: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
  userColor?: string;
}

export interface LiveSession {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    color: string;
    isTyping: boolean;
  }>;
  messages: ChatMessage[];
  relationship: string;
  tone: string;
  status: 'waiting' | 'active' | 'resolved';
  aiQuestionsAsked: boolean;
  createdAt: Date;
}

export interface MediationResult {
  id: string;
  date: string;
  sessionId?: string;
  persons?: Person[];
  participants?: LiveSession['participants'];
  relationship: string;
  tone: string;
  summaries?: string[];
  misunderstandings?: string[];
  sharedThemes?: string[];
  peacePlan?: string;
  chatMessages?: ChatMessage[];
  healingReflection?: {
    journal: string;
    mood: string;
    moodColor: string;
  };
  isHealed?: boolean;
}

export interface ConflictStyle {
  style: string;
  description: string;
  recommendedTone: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('mediate');
  const [currentMediation, setCurrentMediation] = useState<MediationResult | null>(null);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [conflictStyle, setConflictStyle] = useState<ConflictStyle | null>(null);

  useEffect(() => {
    const storedStyle = getStoredData('conflictStyle');
    if (storedStyle) {
      setConflictStyle(storedStyle);
    }
  }, []);

  const handleMediationComplete = (mediation: MediationResult, session?: LiveSession) => {
    setCurrentMediation(mediation);
    if (session) {
      setCurrentSession(session);
    }
    setCurrentView('healing');
  };

  const handleHealingComplete = (healingData: any) => {
    if (currentMediation) {
      const updatedMediation = {
        ...currentMediation,
        healingReflection: healingData,
        isHealed: true
      };
      setCurrentMediation(updatedMediation);
      
      // Store in archive
      const existingArchive = getStoredData('mediationArchive') || [];
      const updatedArchive = [...existingArchive, updatedMediation];
      localStorage.setItem('mediationArchive', JSON.stringify(updatedArchive));
    }
    setCurrentSession(null);
    setCurrentView('archive');
  };

  const handleQuizComplete = (style: ConflictStyle) => {
    setConflictStyle(style);
    localStorage.setItem('conflictStyle', JSON.stringify(style));
    setCurrentView('mediate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          conflictStyle={conflictStyle}
        />
        
        <main className="mt-8">
          {currentView === 'mediate' && (
            <LiveMediation 
              onMediationComplete={handleMediationComplete}
              conflictStyle={conflictStyle}
              onViewChange={setCurrentView}
            />
          )}
          {currentView === 'healing' && currentMediation && (
            <HealingMode 
              mediation={currentMediation}
              session={currentSession}
              onHealingComplete={handleHealingComplete}
            />
          )}
          {currentView === 'archive' && (
            <Archive />
          )}
          {currentView === 'quiz' && (
            <ConflictQuiz onQuizComplete={handleQuizComplete} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;