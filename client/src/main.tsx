import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Dojo & Starknet
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { dojoConfig } from "./dojo/dojoConfig";
import type { SchemaType } from "./dojo/bindings";
import { setupWorld } from "./dojo/contracts.gen";
import StarknetProvider from "./dojo/starknet-provider";

// App Entry
import App from "./app/app";
import "./index.css";

// Init Dojo with error handling
async function main() {
  try {
    console.log("🚀 Initializing Dojo SDK...");

    const sdk = await init<SchemaType>({
      client: {
        toriiUrl: dojoConfig.toriiUrl,
        worldAddress: dojoConfig.manifest.world.address,
      },
      domain: {
        name: "DojoGameStarter",
        version: "1.0",
        chainId: "KATANA",
        revision: "1",
      },
    });

    console.log("✅ Dojo SDK initialized successfully");

    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    createRoot(rootElement).render(
      <StrictMode>
        <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
          <StarknetProvider>
            <App />
          </StarknetProvider>
        </DojoSdkProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error("❌ Failed to initialize Dojo:", error);

    // Show the game interface even if Dojo fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <img src="/icon.png" alt="Game Icon" className="w-12 h-12 rounded-lg" />
                  <div>
                    <h1 className="text-3xl font-bold text-white">Dojo Game Starter</h1>
                    <p className="text-purple-300">Blockchain Gaming Experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
                    <span className="text-red-300 text-sm">⚠️ Offline Mode</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Connect Controller
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-6">
                    <span className="text-green-400">● Online</span>
                    <span className="text-gray-400">Sepolia Testnet</span>
                  </div>
                  <div className="text-gray-400">
                    Dojo SDK: <span className="text-red-400">Disconnected</span>
                  </div>
                </div>
              </div>

              {/* Game Section */}
              <div className="space-y-8 mb-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Game Actions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition-colors">
                          🏋️ Train (+10 XP)
                        </button>
                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg font-semibold transition-colors">
                          ⛏️ Mine (+5 Coins, -5 Health)
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition-colors">
                          💤 Rest (+20 Health)
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Player Stats</h2>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Level:</span>
                          <span className="text-white font-semibold">1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Experience:</span>
                          <span className="text-white font-semibold">0 / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Health:</span>
                          <span className="text-white font-semibold">100 / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Coins:</span>
                          <span className="text-white font-semibold">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🎮</div>
                      <div className="text-sm text-gray-300">MiniGamer</div>
                      <div className="text-xs text-gray-500">1 action</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm text-gray-300">SpeedGamer</div>
                      <div className="text-xs text-gray-500">10 actions</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="text-sm text-gray-300">ProGamer</div>
                      <div className="text-xs text-gray-500">25 actions</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">👑</div>
                      <div className="text-sm text-gray-300">SenseiGamer</div>
                      <div className="text-xs text-gray-500">50 actions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="https://starknet.io" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-center transition-colors">
                    Starknet
                  </a>
                  <a href="https://dojoengine.org" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-center transition-colors">
                    Dojo Engine
                  </a>
                  <a href="https://cartridge.gg" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-center transition-colors">
                    Cartridge
                  </a>
                  <a href="https://discord.com/invite/dojoengine" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-center transition-colors">
                    Discord
                  </a>
                </div>
              </div>

              {/* Error Notice */}
              <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-300 font-semibold mb-2">⚠️ Dojo Connection Error</h3>
                <p className="text-red-200 text-sm mb-2">
                  The game interface is shown in offline mode. To enable full functionality:
                </p>
                <ul className="text-red-200 text-sm space-y-1">
                  <li>• Deploy contracts to Sepolia testnet</li>
                  <li>• Set up environment variables in .env file</li>
                  <li>• Ensure Torii indexer is running</li>
                </ul>
                <details className="mt-3">
                  <summary className="cursor-pointer text-red-300 text-sm">Error Details:</summary>
                  <pre className="text-xs bg-black p-3 rounded mt-2 overflow-auto text-red-200">
                    {error instanceof Error ? error.message : String(error)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </StrictMode>
      );
    }
  }
}

main();
