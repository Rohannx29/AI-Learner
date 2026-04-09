"use client"

import { Suspense } from "react"
import { useState } from "react"
import { chatApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

function ChatPageContent() {
  const { ready } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    <main className="flex flex-col h-screen bg-gray-100">

      <div className="bg-white border-b px-6 py-3">
        <h1 className="font-semibold">Notes Chat</h1>
        <p className="text-xs text-gray-500">
          Ask questions from your uploaded notes
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg mb-2">Ask about your notes</p>
            <p className="text-sm">
              Upload a document first, then ask questions about it here.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl p-3 rounded-lg whitespace-pre-wrap text-sm ${
              msg.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-white text-black shadow-sm"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">AI is thinking...</div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Enter to send)"
          className="flex-1 border p-2 rounded text-sm"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-black text-white px-4 rounded disabled:opacity-40 text-sm"
        >
          Send
        </button>
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