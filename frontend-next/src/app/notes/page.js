"use client"

import { Suspense } from "react"
import { useState } from "react"
import { notesApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

function NotesPageContent() {
  const { ready } = useAuth()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)
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

      <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
      <p className="text-gray-500 text-sm mb-8">
        Supported formats: PDF, DOCX, TXT
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm max-w-md">

        <input
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={(e) => {
            setFile(e.target.files[0])
            setStatus(null)
          }}
          className="block mb-6 text-sm"
        />

        <button
          onClick={uploadFile}
          disabled={!file || loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-40"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {status && (
          <p className={`mt-4 text-sm ${
            status.ok ? "text-green-600" : "text-red-500"
          }`}>
            {status.message}
          </p>
        )}

      </div>

    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesPageContent />
    </Suspense>
  )
}