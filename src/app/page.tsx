import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4 text-amber-400">Bounty</h1>
      <p className="text-gray-400 text-lg mb-8">Track every job application.</p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg">Get started</Link>
        <Link href="/login" className="border border-white/20 text-white px-6 py-3 rounded-lg">Sign in</Link>
      </div>
    </main>
  )
}
