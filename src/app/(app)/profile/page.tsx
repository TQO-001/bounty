"use client"
import { useState, useEffect } from "react"
import type { User } from "@/types"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name: "", title: "", location: "", linkedin_url: "", github_url: "", bio: "", target_role: "", target_salary_min: "", target_salary_max: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(u => {
      setUser(u)
      setForm({
        name: u.name || "",
        title: u.title || "",
        location: u.location || "",
        linkedin_url: u.linkedin_url || "",
        github_url: u.github_url || "",
        bio: u.bio || "",
        target_role: u.target_role || "",
        target_salary_min: u.target_salary_min?.toString() || "",
        target_salary_max: u.target_salary_max?.toString() || "",
      })
      setLoading(false)
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        target_salary_min: form.target_salary_min ? parseInt(form.target_salary_min) : null,
        target_salary_max: form.target_salary_max ? parseInt(form.target_salary_max) : null,
      }),
    })
    if (res.ok) {
      const u = await res.json()
      setUser(u)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8 text-zinc-500 text-sm">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">{user?.email}</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Personal info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name" value={form.name} onChange={v => set("name", v)} required />
            <Field label="Job title / role" value={form.title} onChange={v => set("title", v)} placeholder="Software Engineer" />
          </div>
          <Field label="Location" value={form.location} onChange={v => set("location", v)} placeholder="Cape Town, SA" />
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={3} placeholder="A short intro..."
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50 resize-none transition-colors" />
          </div>
        </section>

        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Links</h2>
          <Field label="LinkedIn URL" value={form.linkedin_url} onChange={v => set("linkedin_url", v)} type="url" placeholder="https://linkedin.com/in/..." />
          <Field label="GitHub URL" value={form.github_url} onChange={v => set("github_url", v)} type="url" placeholder="https://github.com/..." />
        </section>

        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Job search targets</h2>
          <Field label="Target role" value={form.target_role} onChange={v => set("target_role", v)} placeholder="Senior Frontend Engineer" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Min salary target" value={form.target_salary_min} onChange={v => set("target_salary_min", v)} type="number" placeholder="80000" />
            <Field label="Max salary target" value={form.target_salary_max} onChange={v => set("target_salary_max", v)} type="number" placeholder="120000" />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && <p className="text-green-400 text-sm">Saved!</p>}
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void
  required?: boolean; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
    </div>
  )
}
