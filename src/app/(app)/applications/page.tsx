import { getAuthUser } from "@/lib/auth"
import { getApplicationsByUserId } from "@/lib/db/queries/applications"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StatusBadge } from "@/components/StatusBadge"
import { STATUS_LABELS, STATUS_ORDER, type ApplicationStatus } from "@/types"
import { Plus } from "lucide-react"

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  const { status: filterStatus } = await searchParams
  const allApps = await getApplicationsByUserId(user.userId)

  const apps = filterStatus
    ? allApps.filter(a => a.status === filterStatus)
    : allApps

  const grouped = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = allApps.filter(a => a.status === s).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {allApps.length} total
            {filterStatus ? ` — showing ${apps.length} ${STATUS_LABELS[filterStatus as ApplicationStatus]}` : ""}
          </p>
        </div>
        <Link href="/applications/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={15} />
          Add application
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Link
          href="/applications"
          className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            !filterStatus
              ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
              : "border-white/[0.07] text-zinc-400 hover:text-white hover:border-white/[0.14]"
          }`}
        >
          All ({allApps.length})
        </Link>
        {STATUS_ORDER.filter(s => grouped[s] > 0).map(s => (
          <Link
            key={s}
            href={"/applications?status=" + s}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              filterStatus === s
                ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                : "border-white/[0.07] text-zinc-400 hover:text-white hover:border-white/[0.14]"
            }`}
          >
            {STATUS_LABELS[s]} ({grouped[s]})
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {apps.length === 0 && (
        <div className="bg-[#161616] border border-white/[0.07] border-dashed rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="text-white font-semibold mb-2">
            {filterStatus ? "No applications with this status" : "No applications yet"}
          </h3>
          <p className="text-zinc-400 text-sm mb-6">
            {filterStatus ? "Try a different filter." : "Add your first job application to get started."}
          </p>
          {!filterStatus && (
            <Link href="/applications/new"
              className="inline-flex bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add application
            </Link>
          )}
        </div>
      )}

      {/* List */}
      {apps.length > 0 && (
        <div className="space-y-2">
          {apps.map(app => (
            <Link
              key={app.id}
              href={"/applications/" + app.id}
              className="flex items-center justify-between bg-[#161616] hover:bg-[#1e1e1e] border border-white/[0.07] rounded-xl px-5 py-4 transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Company initial */}
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-sm font-bold">
                    {app.company_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white text-sm truncate">{app.job_title}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {app.company_name}
                    {app.location ? " · " + app.location : ""}
                    {app.work_type ? " · " + app.work_type : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {app.salary_min && (
                  <span className="text-xs text-zinc-500 hidden sm:block">
                    ${(app.salary_min / 1000).toFixed(0)}k
                    {app.salary_max ? " – $" + (app.salary_max / 1000).toFixed(0) + "k" : "+"}
                  </span>
                )}
                {app.application_date && (
                  <span className="text-xs text-zinc-500 hidden md:block">
                    {new Date(app.application_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                )}
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
