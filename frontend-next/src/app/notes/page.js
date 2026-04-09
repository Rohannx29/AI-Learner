"use client"

import { Suspense, useState } from "react"
import { notesApi, chatApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

function NotesAssistantContent() {
  const { ready } = useAuth()

  const [file, setFile] = useState(null)
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // UPLOAD
  const uploadFile = async () => {
    if (!file || uploading) return

    setUploading(true)
    setStatus(null)

    try {
      const data = await notesApi.upload(file)

      const newFile = {
        name: file.name,
        status: "ready",
      }

      setFiles((prev) => [...prev, newFile])
      setStatus({
        ok: true,
        message: `${file.name} uploaded successfully`,
      })

      setFile(null)
    } catch (err) {
      setStatus({ ok: false, message: err.message })
    } finally {
      setUploading(false)
    }
  }

  // CHAT
  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: "user", content: input }
    const updated = [...messages, userMessage]

    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const data = await chatApi.ask(input, updated)

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response" },
      ])
    } catch {
      setMessages((prev) => [
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
    <main className="flex h-screen bg-[#0f172a] text-white">

      {/* LEFT → CHAT */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#1e293b] bg-[#020617]/60 backdrop-blur-xl">
          <h1 className="text-lg font-semibold">Notes Assistant</h1>
          <p className="text-sm text-gray-400">
            Chat with your uploaded documents
          </p>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <p className="text-lg mb-2">
                Upload a document to start chatting
              </p>
              <p className="text-sm">
                Your AI will answer based on your notes
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-purple-600 to-cyan-500"
                  : "bg-[#1e293b] border border-[#334155] text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm animate-pulse">
              AI is thinking...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-[#1e293b] bg-[#020617]/60 backdrop-blur-xl">
          <div className="flex gap-3 bg-[#020617] border border-[#334155] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your notes..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500
              hover:scale-105 transition-all disabled:opacity-40"
            >
              Send
            </button>

          </div>
        </div>

      </div>

      {/* RIGHT → FILE PANEL */}
      <div className="w-80 border-l border-[#1e293b] p-4 bg-[#020617]/60 backdrop-blur-xl">

        <h2 className="text-sm font-semibold mb-4 text-gray-300">
          Documents
        </h2>

        {/* UPLOAD BOX */}
        <div className="border-2 border-dashed border-[#334155] rounded-xl p-5 text-center mb-4
          hover:border-purple-500 transition-all">

          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="fileUpload"
          />

          <label htmlFor="fileUpload" className="cursor-pointer text-sm text-gray-400">
            Click or drag file to upload
          </label>

          {file && (
            <p className="mt-2 text-xs text-gray-300">{file.name}</p>
          )}

          <button
            onClick={uploadFile}
            disabled={!file || uploading}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500
            disabled:opacity-40"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* STATUS */}
        {status && (
          <div className={`text-xs mb-4 px-3 py-2 rounded-lg ${
            status.ok
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {status.message}
          </div>
        )}

        {/* FILE LIST */}
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-sm flex justify-between"
            >
              <span>{f.name}</span>
              <span className="text-green-400 text-xs">Ready</span>
            </div>
          ))}
        </div>

      </div>

    </main>
  )
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesAssistantContent />
    </Suspense>
  )
}