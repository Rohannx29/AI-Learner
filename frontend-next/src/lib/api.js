const BASE_URL = process.env.NEXT_PUBLIC_API_URL

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Unified error: surfaces HTTP errors as thrown exceptions
  // so every caller can catch them the same way
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.detail || body.error || `HTTP ${res.status}`
    throw new Error(message)
  }

  return res.json()
}

// --- Auth ---
export const authApi = {
  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (email, password) =>
    request("/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
}

// --- Notes upload (multipart — no Content-Type override) ---
export const notesApi = {
  upload: async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${BASE_URL}/upload-notes`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.detail || body.error || `HTTP ${res.status}`)
    }

    return res.json()
  },
}

// --- RAG chat ---
export const chatApi = {
  ask: (question, history = []) =>
    request("/ask-notes", {
      method: "POST",
      body: JSON.stringify({ question, history }),
    }),
}

// --- Tutor ---
export const tutorApi = {
  ask: (question, history = []) =>
    request("/tutor", {
      method: "POST",
      body: JSON.stringify({ question, history }),
    }),
}

// --- Roadmap ---
export const roadmapApi = {
  generate: (topic, duration = "4 weeks") =>
    request("/roadmap", {
      method: "POST",
      body: JSON.stringify({ topic, duration }),
    }),
}

// --- Explain ---
export const explainApi = {
  explain: (topic) =>
    request("/explain", {
      method: "POST",
      body: JSON.stringify({ topic }),
    }),
}