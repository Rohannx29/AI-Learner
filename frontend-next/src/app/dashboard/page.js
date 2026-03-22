"use client"

export default function Dashboard() {

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-lg shadow text-center">

        <h1 className="text-3xl font-bold mb-4">
          Welcome to AI Learner 🚀
        </h1>

        <p className="text-gray-600">
          You are successfully logged in.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Token: {token ? "Stored ✅" : "Not Found ❌"}
        </p>

      </div>

    </main>
  )
}