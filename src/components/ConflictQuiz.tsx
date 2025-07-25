import React, { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { ConflictStyle } from '../App';

interface ConflictQuizProps {
  onQuizComplete: (style: ConflictStyle) => void;
}

const questions = [
  {
    id: 1,
    question: "When conflict arises, I typically...",
    options: [
      { text: "Address it head-on immediately", value: "direct" },
      { text: "Take time to understand all perspectives", value: "harmonizer" },
      { text: "Try to find a compromise", value: "collaborator" },
      { text: "Avoid confrontation when possible", value: "avoider" }
    ]
  },
  {
    id: 2,
    question: "In heated discussions, I prefer communication that is...",
    options: [
      { text: "Clear and straightforward", value: "direct" },
      { text: "Gentle and understanding", value: "harmonizer" },
      { text: "Solution-focused", value: "collaborator" },
      { text: "Calm and measured", value: "avoider" }
    ]
  },
  {
    id: 3,
    question: "My main goal in resolving conflict is to...",
    options: [
      { text: "Get to the truth quickly", value: "direct" },
      { text: "Preserve relationships", value: "harmonizer" },
      { text: "Find the best solution for everyone", value: "collaborator" },
      { text: "Maintain peace and stability", value: "avoider" }
    ]
  },
  {
    id: 4,
    question: "When emotions run high, I...",
    options: [
      { text: "Push through to resolve things", value: "direct" },
      { text: "Focus on emotional healing first", value: "harmonizer" },
      { text: "Channel emotions into problem-solving", value: "collaborator" },
      { text: "Give everyone space to cool down", value: "avoider" }
    ]
  },
  {
    id: 5,
    question: "I feel most comfortable when mediation is...",
    options: [
      { text: "Efficient and to the point", value: "direct" },
      { text: "Warm and supportive", value: "harmonizer" },
      { text: "Structured and fair", value: "collaborator" },
      { text: "Gentle and non-confrontational", value: "avoider" }
    ]
  }
];

const styleResults = {
  direct: {
    style: "The Direct Communicator",
    description: "You value honesty and efficiency in conflict resolution. You prefer straightforward communication and quick resolution.",
    recommendedTone: "direct"
  },
  harmonizer: {
    style: "The Harmonizer",
    description: "You prioritize emotional well-being and relationship preservation. You excel at creating safe spaces for healing.",
    recommendedTone: "compassionate"
  },
  collaborator: {
    style: "The Collaborator",
    description: "You focus on finding win-win solutions and fair outcomes. You're great at balancing different needs and perspectives.",
    recommendedTone: "formal"
  },
  avoider: {
    style: "The Peaceful Mediator",
    description: "You prefer gentle approaches and giving people space. You excel at reducing tension and maintaining calm.",
    recommendedTone: "compassionate"
  }
};

export function ConflictQuiz({ onQuizComplete }: ConflictQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ConflictStyle | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts = newAnswers.reduce((acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantStyle = Object.keys(counts).reduce((a, b) => 
        counts[a] > counts[b] ? a : b
      );

      const styleResult = styleResults[dominantStyle as keyof typeof styleResults];
      setResult(styleResult);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Conflict Style</h2>
          <div className="text-2xl font-bold text-purple-600 mb-4">{result.style}</div>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">{result.description}</p>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-purple-700 mb-2">Recommended Mediation Tone</h3>
            <div className="text-lg font-medium text-purple-800 capitalize">
              {result.recommendedTone} 🎯
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={20} />
              Retake Quiz
            </button>
            <button
              onClick={() => onQuizComplete(result)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue to Mediation ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">⚖️ Conflict Style Quiz</h2>
          <p className="text-gray-600">Discover your conflict resolution personality</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-purple-700 font-medium">
                      {option.text}
                    </span>
                    <ChevronRight className="text-purple-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}