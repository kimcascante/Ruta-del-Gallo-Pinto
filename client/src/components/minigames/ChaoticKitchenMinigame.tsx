import React, { useState, useEffect, useRef } from 'react';

interface ChaoticKitchenMinigameProps {
  onComplete: (success: boolean, points: number) => void;
  onClose: () => void;
}

export const ChaoticKitchenMinigame: React.FC<ChaoticKitchenMinigameProps> = ({ onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [tasks, setTasks] = useState<Array<{id: number, type: 'chop' | 'fry', completed: boolean}>>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [message, setMessage] = useState('Assign tasks quickly! Space = Chop, Enter = Fry');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (timeRemaining <= 0) {
      const success = completedTasks >= 8;
      onComplete(success, completedTasks * 10);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, completedTasks, onComplete]);

  useEffect(() => {
    initializeTasks();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [tasks, completedTasks, timeRemaining]);

  const initializeTasks = () => {
    const newTasks: Array<{id: number, type: 'chop' | 'fry', completed: boolean}> = [];
    for (let i = 0; i < 12; i++) {
      newTasks.push({
        id: i,
        type: Math.random() > 0.5 ? 'chop' : 'fry',
        completed: false
      });
    }
    setTasks(newTasks);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw kitchen background
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw counter
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 150, canvas.width, 50);

    // Draw tasks
    tasks.forEach((task, index) => {
      const x = 50 + (index % 4) * 120;
      const y = 50 + Math.floor(index / 4) * 80;
      
      if (task.completed) {
        ctx.fillStyle = '#10b981';
      } else {
        ctx.fillStyle = task.type === 'chop' ? '#ef4444' : '#f59e0b';
      }
      
      ctx.fillRect(x, y, 80, 60);
      
      // Draw task icon
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText(task.type === 'chop' ? '🔪' : '🍳', x + 25, y + 35);
      
      // Draw task number
      ctx.font = '12px Arial';
      ctx.fillText(`${task.id + 1}`, x + 35, y + 50);
    });

    // Draw chef (dog)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(canvas.width - 100, 100, 40, 60);
    
    // Draw chef hat
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width - 110, 80, 60, 20);

    // Draw UI
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Tasks: ${completedTasks}/12`, 20, 30);
    ctx.fillText(`Time: ${timeRemaining}s`, canvas.width - 120, 30);
    
    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillText('Space = Chop, Enter = Fry', 20, canvas.height - 20);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (timeRemaining <= 0) return;

    const key = event.key;
    let taskType: 'chop' | 'fry' | null = null;

    if (key === ' ') {
      taskType = 'chop';
    } else if (key === 'Enter') {
      taskType = 'fry';
    }

    if (taskType) {
      const incompleteTask = tasks.find(task => !task.completed && task.type === taskType);
      if (incompleteTask) {
        setTasks(prev => prev.map(task => 
          task.id === incompleteTask.id ? { ...task, completed: true } : task
        ));
        setCompletedTasks(prev => prev + 1);
        setMessage(`Great! Completed ${taskType} task!`);
      } else {
        setMessage(`No ${taskType} tasks available!`);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [tasks, timeRemaining]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">🍳 Chaotic Kitchen</h2>
          <p className="text-gray-300 mb-4">Work together to complete kitchen tasks!</p>
          <p className="text-yellow-400 font-semibold">{message}</p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="border border-white/20 rounded-lg"
          />
        </div>

        <div className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-red-600/20 border border-red-400/30 rounded p-3">
              <span className="text-red-300">Chop Tasks: {tasks.filter(t => t.type === 'chop' && !t.completed).length}</span>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded p-3">
              <span className="text-yellow-300">Fry Tasks: {tasks.filter(t => t.type === 'fry' && !t.completed).length}</span>
            </div>
            <div className="bg-green-600/20 border border-green-400/30 rounded p-3">
              <span className="text-green-300">Completed: {completedTasks}/12</span>
            </div>
          </div>

          <div className="bg-red-600/20 border border-red-400/30 rounded p-3">
            <span className="text-red-300">Time Remaining: {timeRemaining}s</span>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onComplete(false, completedTasks * 10)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Give Up
            </button>
            <button
              onClick={() => onComplete(true, completedTasks * 10)}
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