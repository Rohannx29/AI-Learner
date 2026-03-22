"use client"

import { useState } from "react"

export default function ChatPage() {

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {

      const res = await fetch("http://localhost:8000/ask-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          question: input
        })
      })

      const data = await res.json()

      const aiMessage = {
        role: "assistant",
        content: data.answer || "No response"
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (err) {

      console.error(err)

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error getting response" }
      ])

    } finally {
      setLoading(false)
    }
  }

  return (

    <main className="flex flex-col h-screen bg-gray-100">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`max-w-xl p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-white text-black"
            }`}
          >
            {msg.content}
          </div>

        ))}

        {loading && (
          <div className="text-gray-500">AI is thinking...</div>
        )}

      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex gap-2">

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 border p-2 rounded"
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>

      </div>

    </main>
  )
}