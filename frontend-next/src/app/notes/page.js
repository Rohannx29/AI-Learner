"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { notesApi, chatApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import Markdown from "@/components/Markdown"

function NotesPageContent() {
  const { ready } = useAuth()

  const [file, setFile] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [status, setStatus] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState(false)
  const [input2, setInput2] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const uploadFile = async () => {
    if (!file || uploading) return
    setUploading(true)
    setStatus(null)

    try {
      const data = await notesApi.upload(file)
      setUploadedFiles(prev => [...prev, { name: file.name }])
      setStatus({ ok: true, message: `${file.name} indexed — ${data.chunks_created} chunks` })
      setFile(null)
    } catch (err) {
      setStatus({ ok: false, message: err.message })
    } finally {
      setUploading(false)
    }
  }

  const sendMessage = async () => {
    if (!input2.trim() || loading) return

    const userMessage = { role: "user", content: input2 }
    const updated = [...messages, userMessage]

    setMessages(updated)
    setInput2("")
    setLoading(true)

    try {
      const data = await chatApi.ask(input2, updated)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.answer || "No response" },
      ])
    } catch {
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
    // Fix: h-full (not h-screen) fills the dashboard content area
    <main className="flex h-full bg-[#0f172a] text-white overflow-hidden">

      {/* LEFT — CHAT PANEL */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <div className="flex-shrink-0 px-6 py-4 border-b border-[#1e293b]
          bg-[#020617]/60 backdrop-blur-xl">
          <h1 className="text-lg font-semibold">Notes Assistant</h1>
          <p className="text-sm text-gray-400">
            Chat with your uploaded documents
          </p>
        </div>

        {/* Fix: min-h-0 enables flex child to shrink and scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center
              h-full text-center text-gray-400">
              <p className="text-lg mb-2">Upload a document to start chatting</p>
              <p className="text-sm">Your AI will answer based on your notes</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
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

          <div ref={bottomRef} />
        </div>

        <div className="flex-shrink-0 p-4 border-t border-[#1e293b]
          bg-[#020617]/60 backdrop-blur-xl">
          <div className="flex gap-3 bg-[#020617] border border-[#334155]
            rounded-2xl px-4 py-2
            focus-within:ring-2 focus-within:ring-purple-500">

            <input
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your notes..."
              className="flex-1 bg-transparent outline-none text-sm
                placeholder-gray-400 text-white"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input2.trim()}
              className="flex-shrink-0 px-4 py-2 rounded-xl
                bg-gradient-to-r from-purple-600 to-cyan-500
                hover:scale-105 transition-all disabled:opacity-40 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — FILE PANEL: fixed width, independent scroll */}
      <aside className="w-80 flex-shrink-0 flex flex-col
        border-l border-[#1e293b] bg-[#020617]/60 backdrop-blur-xl
        overflow-hidden">

        <div className="flex-shrink-0 px-4 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-gray-300">Documents</h2>
        </div>

        {/* Upload box */}
        <div className="flex-shrink-0 px-4 pb-4">
          <div className="border-2 border-dashed border-[#334155]
            rounded-xl p-5 text-center
            hover:border-purple-500 transition-all">

            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => {
                setFile(e.target.files[0])
                setStatus(null)
              }}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer text-sm text-gray-400 block"
            >
              Click or drag file to upload
            </label>

            {file && (
              <p className="mt-2 text-xs text-gray-300 truncate">{file.name}</p>
            )}

            <button
              onClick={uploadFile}
              disabled={!file || uploading}
              className="mt-4 w-full py-2 rounded-xl text-sm
                bg-gradient-to-r from-purple-600 to-cyan-500
                disabled:opacity-40 hover:scale-105 transition-all"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {status && (
            <div className={`mt-3 text-xs px-3 py-2 rounded-lg ${
              status.ok
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {status.message}
            </div>
          )}
        </div>

        {/* File list — scrollable independently */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-2">
          {uploadedFiles.map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]
                text-sm flex items-center justify-between gap-2"
            >
              <span className="truncate text-gray-300">{f.name}</span>
              <span className="flex-shrink-0 text-green-400 text-xs">Ready</span>
            </div>
          ))}
        </div>
      </aside>

    </main>
  )
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesPageContent />
    </Suspense>
  )
}