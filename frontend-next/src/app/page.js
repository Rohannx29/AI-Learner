export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="text-center">

        <h1 className="text-5xl font-bold mb-6">
          AI Learner
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          AI-powered learning assistant with OCR, RAG, and mathematical reasoning
        </p>

        <div className="space-x-4">

          <a
            href="/login"
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Login
          </a>

          <a
            href="/signup"
            className="px-6 py-3 border border-black rounded-lg"
          >
            Sign Up
          </a>

        </div>

      </div>

    </main>
  );
}