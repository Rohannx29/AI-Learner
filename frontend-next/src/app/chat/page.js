"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { chatApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import Markdown from "@/components/Markdown"

function ChatPageContent() {
  const { ready } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)
    setError("")

    try {
      const data = await chatApi.ask(input, updatedMessages)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.answer || "No response" },
      ])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error getting response." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!ready) return null

  return (
    // Fix: h-full fills the dashboard content area (not h-screen which
    // would double the viewport height inside the h-screen shell)
    <main className="flex flex-col h-full bg-[#0f172a] text-white">

      {/* HEADER — fixed height, never shrinks */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#1e293b]
        bg-[#020617]/60 backdrop-blur-xl">
        <h1 className="text-lg font-semibold">Notes Assistant</h1>
        <p className="text-sm text-gray-400">
          Ask questions from your uploaded notes
        </p>
      </div>

      {/* MESSAGES — flex-1 + min-h-0 is the key fix.
          min-h-0 allows the flex child to shrink below its content size,
          enabling overflow-y-auto to actually scroll. */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center
            h-full text-center text-gray-400">
            <p className="text-lg mb-2">Upload notes to get started</p>
            <p className="text-sm">
              Ask anything once your document is ready
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
              msg.role === "user"
                ? "ml-auto bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                : "bg-[#1e293b] border border-[#334155] text-gray-200"
            }`}
          >
            {msg.role === "assistant"
              ? <Markdown content={msg.content} />
              : msg.content
            }
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm animate-pulse">
            AI is thinking...
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10
            px-3 py-2 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* INPUT — fixed at bottom, never shrinks */}
      <div className="flex-shrink-0 p-4 border-t border-[#1e293b]
        bg-[#020617]/60 backdrop-blur-xl">
        <div className="flex items-center gap-3 bg-[#020617]
          border border-[#334155] rounded-2xl px-4 py-2
          focus-within:ring-2 focus-within:ring-purple-500 transition-all">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your notes..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-white
              placeholder-gray-400 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm
              font-medium bg-gradient-to-r from-purple-600 to-cyan-500
              hover:scale-105 hover:shadow-lg active:scale-95
              disabled:opacity-40 transition-all"
          >
            Send
          </button>
        </div>
      </div>

    </main>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageContent />
    </Suspense>
  )
}