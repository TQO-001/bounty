"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const STATUSES = ["wishlist","applied","phone_screen","interview","offer","rejected","withdrawn","ghosted"]
const WORK_TYPES = ["onsite","remote","hybrid"]
const PRIORITIES = ["low","medium","high"]

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    company_name: "", job_title: "", job_url: "",
    status: "wishlist", priority: "medium", work_type: "onsite",
    location: "", salary_min: "", salary_max: "",
    application_date: "", source: "", excitement_level: "3",
    notes: "", job_description: "",
  })

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? parseInt(form.salary_min) : undefined,
        salary_max: form.salary_max ? parseInt(form.salary_max) : undefined,
        excitement_level: form.excitement_level ? parseInt(form.excitement_level) : undefined,
        job_url: form.job_url || undefined,
        location: form.location || undefined,
        application_date: form.application_date || undefined,
        source: form.source || undefined,
        notes: form.notes || undefined,
        job_description: form.job_description || undefined,
      }
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      router.push("/applications/" + data.id)
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/applications" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-white">New Application</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Core info */}
        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Position</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company *" value={form.company_name} onChange={v => set("company_name", v)} required placeholder="Acme Corp" />
            <Input label="Job title *" value={form.job_title} onChange={v => set("job_title", v)} required placeholder="Software Engineer" />
          </div>
          <Input label="Job URL" value={form.job_url} onChange={v => set("job_url", v)} placeholder="https://..." type="url" />
          <div className="grid grid-cols-3 gap-4">
            <Select label="Status" value={form.status} onChange={v => set("status", v)} options={STATUSES} />
            <Select label="Work type" value={form.work_type} onChange={v => set("work_type", v)} options={WORK_TYPES} />
            <Input label="Location" value={form.location} onChange={v => set("location", v)} placeholder="Remote / City" />
          </div>
        </section>

        {/* Details */}
        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Salary min" value={form.salary_min} onChange={v => set("salary_min", v)} type="number" placeholder="60000" />
            <Input label="Salary max" value={form.salary_max} onChange={v => set("salary_max", v)} type="number" placeholder="90000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Application date" value={form.application_date} onChange={v => set("application_date", v)} type="date" />
            <Input label="Source" value={form.source} onChange={v => set("source", v)} placeholder="LinkedIn, referral..." />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Excitement level ({form.excitement_level}/5)</label>
            <input type="range" min="1" max="5" value={form.excitement_level} onChange={e => set("excitement_level", e.target.value)}
              className="w-full accent-amber-500" />
          </div>
          <Select label="Priority" value={form.priority} onChange={v => set("priority", v)} options={PRIORITIES} />
        </section>

        {/* Notes */}
        <section className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Notes</h2>
          <Textarea label="Personal notes" value={form.notes} onChange={v => set("notes", v)} placeholder="Anything to remember about this role..." rows={3} />
          <Textarea label="Job description" value={form.job_description} onChange={v => set("job_description", v)} placeholder="Paste the job description here..." rows={4} />
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            {loading ? "Saving..." : "Save application"}
          </button>
          <Link href="/applications" className="text-zinc-400 hover:text-white text-sm transition-colors px-4 py-2.5">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, required, placeholder, type = "text" }: {
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

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#111] border border-white/[0.08] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
        {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
      </select>
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50 resize-none transition-colors" />
    </div>
  )
}
