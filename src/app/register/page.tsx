"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/auth/register", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({name,email,password}) })
    if (res.ok) router.push("/dashboard")
    else {
      const data = await res.json()
      setError(data.error || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">Bounty</h1>
        <p className="text-gray-400 text-center mb-8">Create your account</p>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min 8 characters" minLength={8}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-lg transition-colors">
            Create account
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account? <Link href="/login" className="text-amber-400 hover:text-amber-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
