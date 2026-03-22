"use client"

import { useState } from "react"
import { notesApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function NotesPage() {
  const { ready } = useAuth()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)   // { ok: bool, message: string }
  const [loading, setLoading] = useState(false)

  const uploadFile = async () => {
    if (!file || loading) return

    setLoading(true)
    setStatus(null)

    try {
      const data = await notesApi.upload(file)
      setStatus({
        ok: true,
        message: `Uploaded successfully — ${data.chunks_created} chunks indexed.`,
      })
    } catch (err) {
      setStatus({ ok: false, message: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (!ready) return null

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Upload Notes</h1>

      <input
        type="file"
        accept=".pdf,.txt,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block"
      />

      <button
        onClick={uploadFile}
        disabled={!file || loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-40"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {status && (
        <p className={`mt-4 text-sm ${status.ok ? "text-green-600" : "text-red-500"}`}>
          {status.message}
        </p>
      )}
    </div>
  )
}