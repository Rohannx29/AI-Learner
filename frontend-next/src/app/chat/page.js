"use client"

import { useState } from "react"

export default function Chat() {

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const send = async () => {

    const updated = [...messages, { role: "user", content: input }]
    setMessages(updated)
    setInput("")

    const res = await fetch("http://localhost:8000/ask-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        question: input,
        history: updated
      })
    })

    const data = await res.json()

    setMessages([...updated, { role: "assistant", content: data.answer }])
  }

  return (
    <div className="p-10">
      {messages.map((m, i) => <div key={i}>{m.content}</div>)}

      <input value={input} onChange={e=>setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  )
}