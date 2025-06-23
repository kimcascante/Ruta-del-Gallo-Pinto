import React from "react";

export const StatusBar: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <span className="text-green-400">● Online</span>
          <span className="text-gray-400">Ruta del Gallo Pinto</span>
        </div>
        <div className="text-gray-400">
          Status: <span className="text-green-400">Ready to Play</span>
        </div>
      </div>
    </div>
  );
};
