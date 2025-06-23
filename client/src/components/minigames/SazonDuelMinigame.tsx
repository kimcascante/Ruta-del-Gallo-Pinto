import React, { useState, useEffect } from 'react';
import { IngredientType } from '../../types/game';

interface SazonDuelMinigameProps {
  onComplete: (success: boolean, points: number) => void;
  onClose: () => void;
}

export const SazonDuelMinigame: React.FC<SazonDuelMinigameProps> = ({ onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [sequence, setSequence] = useState<IngredientType[]>([]);
  const [playerSequence, setPlayerSequence] = useState<IngredientType[]>([]);
  const [phase, setPhase] = useState<'showing' | 'input' | 'complete'>('showing');
  const [message, setMessage] = useState('Memorize the sequence!');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete(score > 0, score);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, score, onComplete]);

  useEffect(() => {
    generateSequence();
  }, []);

  const generateSequence = () => {
    const ingredients = Object.values(IngredientType);
    const newSequence: IngredientType[] = [];
    for (let i = 0; i < 4; i++) {
      newSequence.push(ingredients[Math.floor(Math.random() * ingredients.length)]);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setPhase('showing');
    
    // Show sequence for 5 seconds
    setTimeout(() => {
      setPhase('input');
      setMessage('Now replicate the sequence!');
    }, 5000);
  };

  const getIngredientIcon = (type: IngredientType) => {
    switch (type) {
      case IngredientType.RICE:
        return "🍚";
      case IngredientType.BEANS:
        return "🫘";
      case IngredientType.CILANTRO:
        return "🌿";
      case IngredientType.SALSA_LIZANO:
        return "🥫";
    }
  };

  const getIngredientName = (type: IngredientType) => {
    switch (type) {
      case IngredientType.RICE:
        return "Rice";
      case IngredientType.BEANS:
        return "Beans";
      case IngredientType.CILANTRO:
        return "Cilantro";
      case IngredientType.SALSA_LIZANO:
        return "Salsa Lizano";
    }
  };

  const handleIngredientClick = (ingredient: IngredientType) => {
    if (phase !== 'input') return;

    const newPlayerSequence = [...playerSequence, ingredient];
    setPlayerSequence(newPlayerSequence);

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      const isCorrect = newPlayerSequence.every((ing, index) => ing === sequence[index]);
      
      if (isCorrect) {
        setScore(prev => prev + 50);
        setMessage('¡Perfecto! Correct sequence!');
        setPhase('complete');
        
        // Generate new sequence after 2 seconds
        setTimeout(() => {
          generateSequence();
        }, 2000);
      } else {
        setMessage('¡Oops! Wrong sequence. Try again!');
        setPlayerSequence([]);
      }
    }
  };

  const renderSequence = () => {
    return (
      <div className="flex justify-center space-x-4 mb-6">
        {sequence.map((ingredient, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl transition-all duration-300 ${
              phase === 'showing' 
                ? 'bg-yellow-600 border-yellow-400 animate-pulse' 
                : 'bg-gray-600 border-gray-400'
            }`}
          >
            {getIngredientIcon(ingredient)}
          </div>
        ))}
      </div>
    );
  };

  const renderPlayerInput = () => {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Your Sequence</h3>
          <div className="flex justify-center space-x-4">
            {playerSequence.map((ingredient, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg bg-green-600 border-2 border-green-400 flex items-center justify-center text-xl"
              >
                {getIngredientIcon(ingredient)}
              </div>
            ))}
            {Array.from({ length: sequence.length - playerSequence.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-12 rounded-lg bg-gray-600 border-2 border-gray-400 flex items-center justify-center"
              >
                ?
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.values(IngredientType).map(ingredient => (
            <button
              key={ingredient}
              onClick={() => handleIngredientClick(ingredient)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 flex items-center justify-center space-x-2 transition-colors"
            >
              <span className="text-2xl">{getIngredientIcon(ingredient)}</span>
              <span className="text-white font-semibold">{getIngredientName(ingredient)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">🧠 Sazón Duel</h2>
          <p className="text-gray-300 mb-4">Test your memory with ingredient sequences!</p>
          <p className="text-yellow-400 font-semibold">{message}</p>
        </div>

        <div className="space-y-6">
          {/* Sequence Display */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              {phase === 'showing' ? 'Memorize This Sequence:' : 'Target Sequence:'}
            </h3>
            {renderSequence()}
          </div>

          {/* Player Input */}
          {phase === 'input' && renderPlayerInput()}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded p-3">
              <span className="text-blue-300">Score: {score}</span>
            </div>
            <div className="bg-red-600/20 border border-red-400/30 rounded p-3">
              <span className="text-red-300">Time: {timeRemaining}s</span>
            </div>
            <div className="bg-green-600/20 border border-green-400/30 rounded p-3">
              <span className="text-green-300">Progress: {playerSequence.length}/{sequence.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onComplete(false, score)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Give Up
            </button>
            <button
              onClick={() => onComplete(true, score)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 