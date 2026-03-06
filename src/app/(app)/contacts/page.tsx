"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Trash2, ExternalLink, User } from "lucide-react"
import type { Contact } from "@/types"

const RELATIONSHIP_LABELS: Record<string, string> = {
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
  interviewer: "Interviewer",
  employee: "Employee",
  referral: "Referral",
  other: "Other",
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", title: "", email: "", phone: "", linkedin_url: "", relationship: "recruiter", notes: "" })
  const [saving, setSaving] = useState(false)

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function load() {
    const res = await fetch("/api/contacts")
    if (res.ok) setContacts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addContact(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const c = await res.json()
      setContacts(p => [c, ...p])
      setForm({ name: "", title: "", email: "", phone: "", linkedin_url: "", relationship: "recruiter", notes: "" })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this contact?")) return
    await fetch("/api/contacts/" + id, { method: "DELETE" })
    setContacts(p => p.filter(c => c.id !== id))
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{contacts.length} saved</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={15} /> Add contact
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addContact} className="bg-[#161616] border border-amber-500/20 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200">New contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name *" value={form.name} onChange={v => set("name", v)} required placeholder="Jane Smith" />
            <Field label="Title" value={form.title} onChange={v => set("title", v)} placeholder="Senior Recruiter" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={form.email} onChange={v => set("email", v)} type="email" placeholder="jane@company.com" />
            <Field label="Phone" value={form.phone} onChange={v => set("phone", v)} placeholder="+1 555 000 0000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LinkedIn URL" value={form.linkedin_url} onChange={v => set("linkedin_url", v)} type="url" placeholder="https://linkedin.com/in/..." />
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Relationship</label>
              <select value={form.relationship} onChange={e => set("relationship", e.target.value)}
                className="w-full bg-[#111] border border-white/[0.08] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50">
                {Object.entries(RELATIONSHIP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <Field label="Notes" value={form.notes} onChange={v => set("notes", v)} placeholder="Any extra info..." />
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
              {saving ? "Saving..." : "Save contact"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="text-zinc-400 hover:text-white px-5 py-2 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && <p className="text-zinc-500 text-sm py-8 text-center">Loading...</p>}

      {/* Empty */}
      {!loading && contacts.length === 0 && (
        <div className="bg-[#161616] border border-white/[0.07] border-dashed rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-white font-semibold mb-2">No contacts yet</h3>
          <p className="text-zinc-400 text-sm">Track recruiters and hiring managers here.</p>
        </div>
      )}

      {/* List */}
      {!loading && contacts.length > 0 && (
        <div className="space-y-2">
          {contacts.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-[#161616] border border-white/[0.07] rounded-xl px-5 py-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white text-sm">{c.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {c.title || "No title"}
                    {c.relationship && <span className="before:content-['·'] before:mx-1.5">{RELATIONSHIP_LABELS[c.relationship]}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {c.email && (
                  <a href={"mailto:" + c.email}
                    className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-white/[0.04]">
                    {c.email}
                  </a>
                )}
                {c.linkedin_url && (
                  <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-blue-400 transition-colors p-1.5 rounded-md hover:bg-white/[0.04]">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => deleteContact(c.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-500/[0.06]">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
