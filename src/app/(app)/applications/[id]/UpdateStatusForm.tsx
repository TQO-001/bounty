"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { STATUS_LABELS, STATUS_ORDER, type ApplicationStatus } from "@/types"

export function UpdateStatusForm({ appId, currentStatus }: { appId: string; currentStatus: ApplicationStatus }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function save() {
    if (status === currentStatus) return
    setLoading(true)
    await fetch("/api/applications/" + appId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={e => setStatus(e.target.value as ApplicationStatus)}
        className="w-full bg-[#111] border border-white/[0.08] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500/50"
      >
        {STATUS_ORDER.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      <button
        onClick={save}
        disabled={loading || status === currentStatus}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-2 rounded-lg text-sm transition-colors"
      >
        {loading ? "Saving..." : "Update"}
      </button>
    </div>
  )
}
