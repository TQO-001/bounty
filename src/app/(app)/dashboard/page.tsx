import { getAuthUser } from "@/lib/auth"
import { getDashboardStats } from "@/lib/db/queries/applications"
import { redirect } from "next/navigation"
import Link from "next/link"
import { STATUS_LABELS, STATUS_ORDER } from "@/types"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  const stats = await getDashboardStats(user.userId)

  const statCards = [
    { label: "Total applications", value: stats.total, color: "text-white" },
    { label: "Active right now", value: stats.active, color: "text-amber-400" },
    { label: "Applied this week", value: stats.this_week, color: "text-blue-400" },
    { label: "Response rate", value: stats.response_rate + "%", color: "text-green-400" },
    { label: "Interview rate", value: stats.interview_rate + "%", color: "text-purple-400" },
    { label: "Offer rate", value: stats.offer_rate + "%", color: "text-emerald-400" },
  ]

  const activeStatuses = STATUS_ORDER.filter(s => stats.by_status[s] > 0)

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Hey, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {stats.total === 0
            ? "Start by adding your first application."
            : `You have ${stats.active} active application${stats.active !== 1 ? "s" : ""} in your pipeline.`}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-[#161616] border border-white/[0.07] rounded-xl p-5">
            <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      {stats.total > 0 && (
        <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Status breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeStatuses.map(status => (
              <Link
                key={status}
                href={"/applications?status=" + status}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg p-3 transition-colors group"
              >
                <p className="text-xs text-zinc-500 mb-1 capitalize">{STATUS_LABELS[status]}</p>
                <p className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {stats.by_status[status]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats.total === 0 && (
        <div className="bg-[#161616] border border-white/[0.07] border-dashed rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">🎯</p>
          <h3 className="text-white font-semibold mb-2">Track your first application</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Add jobs you want to apply to or have already applied for.
          </p>
          <Link href="/applications/new"
            className="inline-flex bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            Add application
          </Link>
        </div>
      )}
    </div>
  )
}
