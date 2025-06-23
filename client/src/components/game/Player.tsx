import React from 'react';
import { Player as PlayerType } from '../../types/game';

interface PlayerProps {
  player: PlayerType;
  isCurrentPlayer: boolean;
}

export const Player: React.FC<PlayerProps> = ({ player, isCurrentPlayer }) => {
  const getPlayerStyle = () => {
    const baseStyle = "absolute w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-white font-bold text-sm";
    
    if (isCurrentPlayer) {
      return `${baseStyle} bg-blue-600 border-blue-300 shadow-lg shadow-blue-500/50`;
    } else {
      return `${baseStyle} bg-gray-600 border-gray-400`;
    }
  };

  const getPlayerIcon = () => {
    // Dog chef emoji with chef hat
    return "🐕‍🦺";
  };

  return (
    <div
      className={getPlayerStyle()}
      style={{
        left: `${player.x * 48 + 8}px`,
        top: `${player.y * 48 + 8}px`,
        zIndex: isCurrentPlayer ? 10 : 5,
      }}
      title={`Player ${player.id} - Score: ${player.score} - Movement: ${player.movementPoints}`}
    >
      {getPlayerIcon()}
      {isCurrentPlayer && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}; 