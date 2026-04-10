"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const FEATURES = [
  {
    label: "Notes Assistant",
    description: "Chat with your uploaded documents using AI",
    route: "/notes",
    icon: "💬",
  },
  {
    label: "AI Tutor",
    description: "Ask anything and get instant explanations",
    route: "/tutor",
    icon: "🎓",
  },
  {
    label: "Roadmap Generator",
    description: "Generate a structured weekly learning plan",
    route: "/roadmap",
    icon: "🧠",
  },
]

export default function Dashboard() {
  const { ready } = useAuth()
  const router = useRouter()

  if (!ready) return null

  return (
    // Fix: h-full overflow-y-auto — scrollable content page
    <div className="h-full overflow-y-auto bg-[#0f172a] text-white">
      <div className="p-8">

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">What do you want to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6
          max-w-4xl">
          {FEATURES.map((f) => (
            <div
              key={f.route}
              onClick={() => router.push(f.route)}
              className="cursor-pointer p-6 rounded-2xl
                bg-[#1e293b] border border-[#334155]
                hover:scale-[1.03] hover:shadow-xl
                transition-all duration-300 group"
            >
              <div className="text-3xl mb-4
                group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h2 className="text-lg font-semibold mb-2">{f.label}</h2>
              <p className="text-sm text-gray-400">{f.description}</p>
              <div className="mt-4 h-0.5 w-0
                bg-gradient-to-r from-purple-500 to-cyan-500
                group-hover:w-full transition-all duration-300 rounded-full"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}