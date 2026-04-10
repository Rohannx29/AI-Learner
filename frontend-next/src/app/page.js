export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-2xl">

        {/* TITLE */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 
          bg-gradient-to-r from-purple-400 to-cyan-400 
          bg-clip-text text-transparent">
          AI Learner
        </h1>

        {/* SUBTITLE */}
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Your AI-powered learning assistant for smart studying, 
          document-based Q&A, and personalized roadmaps.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">

          <a
            href="/login"
            className="px-6 py-3 rounded-xl font-medium
            bg-gradient-to-r from-purple-600 to-cyan-500
            hover:scale-105 hover:shadow-lg active:scale-95
            transition-all"
          >
            Get Started
          </a>

          <a
            href="/signup"
            className="px-6 py-3 rounded-xl border border-[#334155]
            text-gray-300 hover:bg-[#1e293b] hover:text-white
            transition-all"
          >
            Create Account
          </a>

        </div>

        {/* FEATURES */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

          <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155]">
            📄 Upload & Chat
          </div>

          <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155]">
            🤖 AI Tutor
          </div>

          <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155]">
            🧠 Roadmaps
          </div>

        </div>

      </div>
    </main>
  )
}