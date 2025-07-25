import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag, Heart, BookOpen } from 'lucide-react';
import { MediationResult } from '../App';
import { getStoredData } from '../utils/storage';

export function Archive() {
  const [mediations, setMediations] = useState<MediationResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMediation, setSelectedMediation] = useState<MediationResult | null>(null);

  useEffect(() => {
    const stored = getStoredData('mediationArchive') || [];
    setMediations(stored.sort((a: MediationResult, b: MediationResult) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const filteredMediations = mediations.filter(mediation => {
    const matchesSearch = mediation.peacePlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mediation.persons.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'healed' && mediation.isHealed) ||
                         (filterType === 'unhealed' && !mediation.isHealed) ||
                         mediation.relationship === filterType;
    return matchesSearch && matchesFilter;
  });

  if (selectedMediation) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMediation(null)}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back to Archive
        </button>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedMediation.isHealed ? '✨ Healed Conflict' : '🔄 In Progress'}
            </h2>
            <p className="text-gray-600">
              {new Date(selectedMediation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Relationship & Tone */}
          <div className="flex justify-center gap-4 mb-6">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {selectedMediation.relationship}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {selectedMediation.tone} tone
            </span>
          </div>

          {/* Session Messages or Peace Plan */}
          {selectedMediation.chatMessages ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <span>💬</span> Session Messages
              </h3>
              <div className="bg-blue-50 rounded-2xl p-6 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {selectedMediation.chatMessages.slice(-10).map((msg, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-blue-700">{msg.userName}:</span>
                      <span className="text-blue-800 ml-2">{msg.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedMediation.peacePlan && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <span>🕊</span> Peace Plan
              </h3>
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-blue-800 whitespace-pre-line">{selectedMediation.peacePlan}</p>
              </div>
            </div>
          )}

          {/* Healing Reflection */}
          {selectedMediation.healingReflection && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                <span>🌱</span> Healing Reflection
              </h3>
              <div className={`bg-gradient-to-r ${selectedMediation.healingReflection.moodColor} rounded-2xl p-6 text-white`}>
                <p className="mb-3">
                  <strong>Mood:</strong> {selectedMediation.healingReflection.mood}
                </p>
                <p>
                  <strong>Reflection:</strong> {selectedMediation.healingReflection.journal}
                </p>
              </div>
            </div>
          )}

          {/* Shared Themes (only for traditional mediations) */}
          {selectedMediation.sharedThemes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                <span>🤝</span> Shared Themes
              </h3>
              <div className="bg-green-50 rounded-2xl p-6">
                <ul className="space-y-2">
                  {selectedMediation.sharedThemes.map((theme, index) => (
                    <li key={index} className="text-green-700">• {theme}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Archive Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📜 MendIt Archive</h2>
        <p className="text-gray-600">Your journey of resolved conflicts and personal growth</p>
        <div className="mt-4 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{mediations.length}</div>
            <div className="text-gray-500">Total Mediations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mediations.filter(m => m.isHealed).length}
            </div>
            <div className="text-gray-500">Healed Conflicts</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search mediations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Mediations</option>
            <option value="healed">Healed Only</option>
            <option value="unhealed">In Progress</option>
            <option value="couple">Couples</option>
            <option value="friends">Friends</option>
            <option value="family">Family</option>
            <option value="colleagues">Colleagues</option>
          </select>
        </div>
      </div>

      {/* Mediations List */}
      <div className="space-y-4">
        {filteredMediations.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No mediations yet</h3>
            <p className="text-gray-500">Start your healing journey by creating your first mediation</p>
          </div>
        ) : (
          filteredMediations.map((mediation) => (
            <div
              key={mediation.id}
              onClick={() => setSelectedMediation(mediation)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${mediation.isHealed ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <h3 className="font-semibold text-gray-800">
                    {mediation.isHealed ? '✨ Resolved' : '🔄 In Progress'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {new Date(mediation.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {mediation.relationship}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {mediation.participants?.length || mediation.persons?.length || 0} people
                </span>
                {mediation.healingReflection && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {mediation.healingReflection.mood}
                  </span>
                )}
                {mediation.sessionId && (
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    Live Session
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 line-clamp-2">
                {mediation.peacePlan.substring(0, 150)}...
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    {mediation.persons.length} people
                  </div>
                  {mediation.healingReflection && (
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      Reflected
                    </div>
                  )}
                </div>
                <span className="text-purple-600 text-sm font-medium">View Details →</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}