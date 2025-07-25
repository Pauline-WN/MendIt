import React, { useState } from 'react';
import { Heart, CheckCircle, Sparkles } from 'lucide-react';
import { MediationResult, LiveSession } from '../App';

interface HealingModeProps {
  mediation: MediationResult;
  session?: LiveSession | null;
  onHealingComplete: (healingData: any) => void;
}

const moodOptions = [
  { emoji: '😊', label: 'Peaceful', color: 'from-green-400 to-blue-400' },
  { emoji: '🥰', label: 'Grateful', color: 'from-pink-400 to-purple-400' },
  { emoji: '😌', label: 'Relieved', color: 'from-blue-400 to-indigo-400' },
  { emoji: '💪', label: 'Empowered', color: 'from-orange-400 to-red-400' },
  { emoji: '🌟', label: 'Hopeful', color: 'from-yellow-400 to-orange-400' },
  { emoji: '🤗', label: 'Connected', color: 'from-purple-400 to-pink-400' },
];

export function HealingMode({ mediation, session, onHealingComplete }: HealingModeProps) {
  const [journal, setJournal] = useState('');
  const [selectedMood, setSelectedMood] = useState<typeof moodOptions[0] | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<string[]>([]);

  const triggerFloatingEmojis = () => {
    const emojis = ['✨', '🌟', '💖', '🦋', '🌸', '🕊️'];
    setFloatingEmojis(emojis);
    setTimeout(() => setFloatingEmojis([]), 3000);
  };

  const handleMarkAsHealed = async () => {
    if (!journal.trim() || !selectedMood) {
      alert('Please complete your reflection and select your mood');
      return;
    }

    setIsHealing(true);
    
    // Simulate healing animation
    triggerFloatingEmojis();
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowConfetti(true);
    
    // Complete healing after confetti
    setTimeout(() => {
      onHealingComplete({
        journal,
        mood: selectedMood.label,
        moodColor: selectedMood.color
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Healing Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🕊 Healing Mode</h2>
        <p className="text-gray-600">Take a moment to reflect and process your feelings</p>
        
        {/* Breathing Animation */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 animate-pulse"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 animate-ping opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🌸</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Breathe in... Breathe out...</p>
      </div>

      {/* Session Summary */}
      {session ? (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <span>💬</span> Your Live Session Summary
          </h3>
          <div className="bg-white/50 rounded-2xl p-6">
            <p className="text-gray-700 mb-4">
              <strong>Session with:</strong> {session.participants.map(p => p.name).join(', ')}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Messages exchanged:</strong> {session.messages.filter(m => m.type === 'user').length}
            </p>
            <p className="text-gray-700">
              <strong>Relationship:</strong> {session.relationship} | <strong>Tone:</strong> {session.tone}
            </p>
          </div>
        </div>
      ) : mediation.peacePlan && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <span>📋</span> Your Mediation Summary
          </h3>
          <div className="bg-white/50 rounded-2xl p-6">
            <p className="text-gray-700 mb-4"><strong>Peace Plan:</strong></p>
            <p className="text-gray-600 whitespace-pre-line">{mediation.peacePlan}</p>
          </div>
        </div>
      )}

      {/* Journaling Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          <span>✏️</span> Reflection Journal
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling about the mediation? What insights did you gain?
            </label>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="I feel... I learned... Moving forward, I want to..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Mood Picker */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-pink-700 mb-4 flex items-center gap-2">
          <span>🎨</span> How are you feeling right now?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moodOptions.map((mood, index) => (
            <button
              key={index}
              onClick={() => setSelectedMood(mood)}
              className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                selectedMood?.label === mood.label
                  ? `bg-gradient-to-r ${mood.color} text-white border-white shadow-lg`
                  : 'bg-white border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
        
        {selectedMood && (
          <div className={`mt-6 p-4 rounded-2xl bg-gradient-to-r ${selectedMood.color} text-white text-center`}>
            <p className="font-medium">Feeling {selectedMood.label} {selectedMood.emoji}</p>
          </div>
        )}
      </div>

      {/* Mark as Healed Button */}
      <div className="text-center">
        <button
          onClick={handleMarkAsHealed}
          disabled={isHealing || !journal.trim() || !selectedMood}
          className="px-12 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHealing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Healing in progress...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle size={24} />
              Mark as Healed
            </div>
          )}
        </button>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-200/20 animate-pulse"></div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            >
              <span className="text-2xl">
                {['✨', '🌟', '💖', '🎉', '🌸', '🦋'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Floating Emojis */}
      {floatingEmojis.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {floatingEmojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: i * 0.2 + 's',
                animationDuration: '3s'
              }}
            >
              <span className="text-3xl opacity-80">{emoji}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}