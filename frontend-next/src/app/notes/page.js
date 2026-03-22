"use client"

import { useState } from "react"

export default function NotesPage() {

  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const uploadFile = async () => {

    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)

    try {

      const res = await fetch("http://localhost:8000/upload-notes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      })

      const data = await res.json()

      setMessage("Upload successful ✅")

    } catch (err) {

      console.error(err)
      setMessage("Upload failed ❌")

    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        📄 Upload Notes
      </h1>

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
        className="mb-4"
      />

      <br />

      <button
        onClick={uploadFile}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {loading && <p className="mt-3">Uploading...</p>}

      <p className="mt-3">{message}</p>

    </div>
  )
}