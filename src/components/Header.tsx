import React from 'react';
import { Heart, Archive, BookOpen, Scale } from 'lucide-react';
import { View, ConflictStyle } from '../App';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  conflictStyle: ConflictStyle | null;
}

export function Header({ currentView, onViewChange, conflictStyle }: HeaderProps) {
  const navItems = [
    { id: 'mediate', label: 'Live Mediation', icon: Heart, emoji: '💬' },
    { id: 'healing', label: 'Healing Mode', icon: BookOpen, emoji: '🕊' },
    { id: 'archive', label: 'Archive', icon: Archive, emoji: '📜' },
    { id: 'quiz', label: 'Style Quiz', icon: Scale, emoji: '⚖️' },
  ] as const;

  return (
    <header className="text-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
          MendIt ✨
        </h1>
        <p className="text-lg text-gray-600 font-medium">Let AI Mediate It</p>
        {conflictStyle && (
          <p className="text-sm text-purple-600 mt-2">
            Your style: {conflictStyle.style} 💜
          </p>
        )}
      </div>

      <nav className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-white/50 hover:text-purple-600'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="font-medium hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}