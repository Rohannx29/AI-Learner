"use client"

import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }) {

  const router = useRouter()

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-4 flex flex-col">

        <h2 className="text-xl font-bold mb-6">AI Learner</h2>

        <button
          onClick={() => router.push("/chat")}
          className="mb-2 text-left hover:bg-gray-800 p-2 rounded"
        >
          💬 Chat
        </button>

        <button
          onClick={() => router.push("/notes")}
          className="mb-2 text-left hover:bg-gray-800 p-2 rounded"
        >
          📄 Upload Notes
        </button>

        <button
          onClick={() => router.push("/roadmap")}
          className="mb-2 text-left hover:bg-gray-800 p-2 rounded"
        >
          🧠 Roadmap
        </button>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              router.push("/login")
            }}
            className="w-full bg-red-500 p-2 rounded"
          >
            Logout
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {children}
      </div>

    </div>
  )
}