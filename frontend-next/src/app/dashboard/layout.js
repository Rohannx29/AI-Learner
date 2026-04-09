"use client"

import { useRouter, usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "Notes Assistant", icon: "💬", route: "/chat" },
  { label: "AI Tutor", icon: "🎓", route: "/tutor" },
  { label: "Upload Notes", icon: "📄", route: "/notes" },
  { label: "Roadmap", icon: "🧠", route: "/roadmap" },
]

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* SIDEBAR */}
      <div className="w-64 p-4 flex flex-col 
        bg-[#020617]/70 backdrop-blur-xl border-r border-[#1e293b]">

        {/* LOGO */}
        <h2 className="text-xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          AI Learner
        </h2>

        {/* NAV */}
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.route

            return (
              <button
                key={item.route}
                onClick={() => router.push(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                transition-all duration-300
                ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>

        {/* LOGOUT */}
        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              router.push("/login")
            }}
            className="w-full py-2 rounded-xl text-sm font-medium 
            bg-red-500/10 border border-red-500/20 text-red-400
            hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  )
}