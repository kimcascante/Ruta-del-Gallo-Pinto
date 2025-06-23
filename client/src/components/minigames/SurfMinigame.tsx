import React, { useState, useEffect, useRef } from 'react';

interface SurfMinigameProps {
  onComplete: (success: boolean, points: number) => void;
  onClose: () => void;
}

export const SurfMinigame: React.FC<SurfMinigameProps> = ({ onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('Get ready to surf!');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete(score > 50, score);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, score, onComplete]);

  useEffect(() => {
    if (!isPlaying) {
      generateSequence();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    drawCanvas();
  }, [sequence, currentIndex, score]);

  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < 5; i++) {
      newSequence.push(Math.floor(Math.random() * 2)); // 0 = left, 1 = right
    }
    setSequence(newSequence);
    setCurrentIndex(0);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wave background
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waves
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 100 + i * 50);
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.lineTo(x, 100 + i * 50 + Math.sin(x * 0.02 + Date.now() * 0.001) * 10);
      }
      ctx.stroke();
    }

    // Draw surfer (dog chef)
    const surferX = canvas.width / 2;
    const surferY = 120;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(surferX - 15, surferY - 20, 30, 40);

    // Draw surfboard
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(surferX - 20, surferY + 20, 40, 8);

    // Draw sequence indicator
    if (sequence.length > 0 && currentIndex < sequence.length) {
      const direction = sequence[currentIndex];
      ctx.fillStyle = direction === 0 ? '#ef4444' : '#10b981';
      ctx.fillRect(direction === 0 ? 50 : canvas.width - 80, 50, 30, 30);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(direction === 0 ? '←' : '→', direction === 0 ? 60 : canvas.width - 70, 70);
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Time: ${timeRemaining}s`, canvas.width - 120, 40);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isPlaying || currentIndex >= sequence.length) return;

    const pressedKey = event.key === 'ArrowLeft' ? 0 : event.key === 'ArrowRight' ? 1 : null;
    
    if (pressedKey !== null) {
      if (pressedKey === sequence[currentIndex]) {
        setScore(prev => prev + 20);
        setMessage('¡Pura vida! Great timing!');
      } else {
        setMessage('Oops! Wrong direction!');
      }
      
      setCurrentIndex(prev => prev + 1);
      
      if (currentIndex + 1 >= sequence.length) {
        setTimeout(() => {
          generateSequence();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, sequence, isPlaying]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">🏄 Surf in Playa Tamarindo</h2>
          <p className="text-gray-300 mb-4">Use ← → arrow keys to match the rhythm and keep your balance!</p>
          <p className="text-yellow-400 font-semibold">{message}</p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="border border-white/20 rounded-lg"
          />
        </div>

        <div className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded p-3">
              <span className="text-blue-300">Score: {score}</span>
            </div>
            <div className="bg-red-600/20 border border-red-400/30 rounded p-3">
              <span className="text-red-300">Time: {timeRemaining}s</span>
            </div>
          </div>

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