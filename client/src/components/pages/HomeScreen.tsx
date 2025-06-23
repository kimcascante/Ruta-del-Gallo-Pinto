import { Header } from "../header"
import { StatusBar } from "../status-bar"
import { GameSection } from "../game-section"
import { LinksSection } from "../links-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        <StatusBar />
        <GameSection />
        <LinksSection />
      </div>
    </div>
  )
}