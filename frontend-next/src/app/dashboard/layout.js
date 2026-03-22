"use client"

import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }) {
  const router = useRouter()

  return (
    <div className="flex h-screen">

      <div className="w-64 bg-black text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">AI Learner</h2>

        {[
          { label: "Notes Chat",   icon: "💬", route: "/chat"    },
          { label: "AI Tutor",     icon: "🎓", route: "/tutor"   },
          { label: "Upload Notes", icon: "📄", route: "/notes"   },
          { label: "Roadmap",      icon: "🧠", route: "/roadmap" },
        ].map((item) => (
          <button
            key={item.route}
            onClick={() => router.push(item.route)}
            className="mb-1 text-left hover:bg-gray-800 p-2 rounded flex items-center gap-2"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              router.push("/login")
            }}
            className="w-full bg-red-500 p-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 overflow-hidden">
        {children}
      </div>

    </div>
  )
}