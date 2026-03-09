"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", name: "", password: "" })
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("")
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { router.push("/dashboard"); router.refresh() }
    else { const d = await res.json(); setError(d.error || "Registration failed"); setLoading(false) }
  }
  return (
    <div className="rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <h1 className="text-lg font-bold mb-6" style={{ color: "var(--text)" }}>Create account</h1>
      {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        {[["Full name","name","text"],["Email","email","email"],["Password","password","password"]].map(([l,k,t]) => (
          <div key={k}><label className="block text-xs mb-1.5" style={{ color: "var(--muted)" }}>{l}</label>
            <input type={t} value={(form as Record<string,string>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} required className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={{ background: "var(--input-bg)", border: "1px solid var(--border-2)", color: "var(--text)" }} /></div>
        ))}
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-semibold text-black disabled:opacity-60" style={{ background: "var(--amber)" }}>{loading ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>Have an account? <Link href="/login" style={{ color: "var(--amber)" }}>Sign in</Link></p>
    </div>
  )
}
