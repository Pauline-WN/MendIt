import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Copy, Share2, CheckCircle, MessageCircle, UserPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { LiveSession, ChatMessage, MediationResult, ConflictStyle, View } from '../App';
import { generateAIResponse, generateMediationSummary } from '../utils/mockAI';

interface LiveMediationProps {
  onMediationComplete: (mediation: MediationResult, session: LiveSession) => void;
  conflictStyle: ConflictStyle | null;
  onViewChange: (view: View) => void;
}

const userColors = [
  'from-purple-400 to-pink-400',
  'from-blue-400 to-indigo-400',
  'from-green-400 to-teal-400',
  'from-orange-400 to-red-400',
  'from-pink-400 to-rose-400',
  'from-indigo-400 to-purple-400'
];

const avatarEmojis = ['👤', '🙋‍♀️', '🙋‍♂️', '👩', '👨', '🧑'];

export function LiveMediation({ onMediationComplete, conflictStyle, onViewChange }: LiveMediationProps) {
  const [mode, setMode] = useState<'create' | 'join' | 'chat'>('create');
  const [sessionCode, setSessionCode] = useState('');
  const [userName, setUserName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [tone, setTone] = useState(conflictStyle?.recommendedTone || '');
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [currentUserId] = useState(uuidv4());
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const createSession = () => {
    if (!userName.trim() || !relationship || !tone) {
      alert('Please fill in all required fields');
      return;
    }

    const newSession: LiveSession = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      participants: [{
        id: currentUserId,
        name: userName,
        color: userColors[0],
        isTyping: false
      }],
      messages: [{
        id: uuidv4(),
        userId: 'system',
        userName: 'MendIt AI',
        message: `Welcome to your mediation session! I'm here to help facilitate a peaceful conversation. Waiting for other participants to join...`,
        timestamp: new Date(),
        type: 'system'
      }],
      relationship,
      tone,
      status: 'waiting',
      aiQuestionsAsked: false,
      createdAt: new Date()
    };

    setCurrentSession(newSession);
    setMode('chat');
  };

  const joinSession = () => {
    if (!userName.trim() || !sessionCode.trim()) {
      alert('Please enter your name and session code');
      return;
    }

    // In a real app, this would connect to the actual session
    // For demo purposes, we'll create a mock session
    const mockSession: LiveSession = {
      id: sessionCode.toUpperCase(),
      participants: [
        {
          id: 'existing-user',
          name: 'Alex',
          color: userColors[0],
          isTyping: false
        },
        {
          id: currentUserId,
          name: userName,
          color: userColors[1],
          isTyping: false
        }
      ],
      messages: [
        {
          id: uuidv4(),
          userId: 'system',
          userName: 'MendIt AI',
          message: `Welcome ${userName}! Alex is already here. Let's begin our mediation session.`,
          timestamp: new Date(),
          type: 'system'
        }
      ],
      relationship: 'friends',
      tone: 'compassionate',
      status: 'active',
      aiQuestionsAsked: false,
      createdAt: new Date()
    };

    setCurrentSession(mockSession);
    setMode('chat');
    
    // Simulate AI asking clarifying questions
    setTimeout(() => {
      askClarifyingQuestions(mockSession);
    }, 1000);
  };

  const askClarifyingQuestions = (session: LiveSession) => {
    if (session.aiQuestionsAsked) return;

    const questions = [
      "Before we begin, I'd like each of you to share: What outcome are you hoping for from this conversation?",
      "And secondly: What's one thing you'd like the other person to understand about your perspective?"
    ];

    questions.forEach((question, index) => {
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'ai',
          userName: 'MendIt AI',
          message: question,
          timestamp: new Date(),
          type: 'ai'
        };

        setCurrentSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, aiMessage],
          aiQuestionsAsked: index === questions.length - 1
        } : null);
      }, (index + 1) * 2000);
    });
  };

  const sendMessage = () => {
    if (!message.trim() || !currentSession) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      userId: currentUserId,
      userName: userName,
      message: message.trim(),
      timestamp: new Date(),
      type: 'user',
      userColor: currentSession.participants.find(p => p.id === currentUserId)?.color
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage]
    };

    setCurrentSession(updatedSession);
    setMessage('');
    setIsTyping(false);

    // Simulate AI response after user messages
    if (currentSession.aiQuestionsAsked && Math.random() > 0.3) {
      setTimeout(() => {
        const aiResponse = generateAIResponse(updatedSession.messages, updatedSession.tone);
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          userId: 'ai',
          userName: 'MendIt AI',
          message: aiResponse,
          timestamp: new Date(),
          type: 'ai'
        };

        setCurrentSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, aiMessage]
        } : null);
      }, 1500);
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      // In real app, broadcast typing status
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const resolveSession = () => {
    if (!currentSession) return;

    const mediationResult = generateMediationSummary(currentSession);
    onMediationComplete(mediationResult, currentSession);
  };

  const copySessionCode = () => {
    if (currentSession) {
      navigator.clipboard.writeText(currentSession.id);
      alert('Session code copied to clipboard!');
    }
  };

  if (mode === 'create') {
    return (
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">💬 Start Live Mediation</h2>
            <p className="text-gray-600">Create a session and invite others to join</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select relationship...</option>
                <option value="couple">💕 Couple</option>
                <option value="friends">👫 Friends</option>
                <option value="family">👪 Family</option>
                <option value="colleagues">🤝 Colleagues</option>
                <option value="other">🤷 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone of Mediation *
                {conflictStyle && (
                  <span className="text-xs text-purple-600 ml-2">
                    (Recommended: {conflictStyle.recommendedTone})
                  </span>
                )}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select tone...</option>
                <option value="funny">😄 Funny</option>
                <option value="compassionate">💗 Compassionate</option>
                <option value="direct">🎯 Direct</option>
                <option value="formal">📋 Formal</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={createSession}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  Create Session
                </div>
              </button>
              <button
                onClick={() => setMode('join')}
                className="flex-1 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus size={20} />
                  Join Session
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🔗 Join Live Session</h2>
            <p className="text-gray-600">Enter the session code shared with you</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Code *
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code..."
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setMode('create')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={joinSession}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'chat' && currentSession) {
    return (
      <div className="space-y-6">
        {/* Session Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Live Mediation Session</h2>
              <p className="text-gray-600">Session: {currentSession.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copySessionCode}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
              >
                <Copy size={16} />
                Copy Code
              </button>
              <button
                onClick={() => {/* Share functionality */}}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Participants:</span>
            <div className="flex gap-2">
              {currentSession.participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${participant.color} text-white text-sm`}
                >
                  <span>{avatarEmojis[index % avatarEmojis.length]}</span>
                  <span>{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' && msg.userId === currentUserId ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.type === 'system'
                      ? 'bg-gray-100 text-gray-700 text-center text-sm'
                      : msg.type === 'ai'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : msg.userId === currentUserId
                      ? `bg-gradient-to-r ${msg.userColor || 'from-purple-400 to-pink-400'} text-white`
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.type !== 'system' && (
                    <div className="text-xs opacity-75 mb-1">
                      {msg.userName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>{typingUsers[0]} is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Session Actions */}
        <div className="text-center">
          <button
            onClick={resolveSession}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={24} />
              Mark as Resolved & Continue to Healing
            </div>
          </button>
        </div>
      </div>
    );
  }

  return null;
}