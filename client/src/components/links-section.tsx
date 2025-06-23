import { ExternalLink, Github, MessageCircle } from "lucide-react"

export function LinksSection() {
  return (
    <div className="text-center py-8 border-t border-white/10">
      <div className="flex items-center justify-center gap-6 mb-4">
        <a
          href="https://github.com/dojoengine/dojo-game-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </a>
        <a
          href="https://discord.com/invite/dojoengine"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Discord</span>
        </a>
        <a
          href="https://dojoengine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Dojo Engine</span>
        </a>
      </div>
      <div className="text-slate-500 text-sm">
        Built with ❤️ for the Starknet gaming community
      </div>
    </div>
  )
}
