import DojoLogo from "../assets/Dojo-Logo-Stylized-Red.svg";
import DojoByExampleLogo from "../assets/DojoByExample_logo.svg";
import StarknetLogo from "../assets/SN-Linear-Gradient.svg";

export function Header() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Main title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
          🎮 Dojo Game Starter
        </h1>
        <p className="text-slate-300 text-lg md:text-xl">
          The fastest way to build onchain games on Starknet
        </p>
      </div>

      {/* Technology logos */}
      <div className="flex items-center justify-center gap-6 md:gap-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <img src={DojoLogo} alt="Dojo Engine" className="h-8 w-auto" />
          <span className="text-white font-semibold text-sm">Dojo Engine</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <img src={DojoByExampleLogo} alt="Dojo by Example" className="h-8 w-auto" />
          <span className="text-white font-semibold text-sm">Dojo by Example</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <img src={StarknetLogo} alt="Starknet" className="h-8 w-auto" />
          <span className="text-white font-semibold text-sm">Starknet</span>
        </div>
      </div>
    </div>
  );
}