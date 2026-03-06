import { getAuthUser } from "@/lib/auth"
import { getApplicationById } from "@/lib/db/queries/applications"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { StatusBadge } from "@/components/StatusBadge"
import { ArrowLeft, ExternalLink, MapPin, Briefcase, DollarSign, Calendar, Zap } from "lucide-react"
import { PRIORITY_COLORS } from "@/types"
import { UpdateStatusForm } from "./UpdateStatusForm"

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser()
  if (!user) redirect("/login")

  const app = await getApplicationById(id, user.userId)
  if (!app) notFound()

  const excite = app.excitement_level ?? 0

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Link href="/applications" className="text-zinc-400 hover:text-white transition-colors mt-1">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{app.job_title}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-zinc-400">
              {app.company_name}
              {app.location && <span className="before:content-['·'] before:mx-2">{app.location}</span>}
            </p>
          </div>
        </div>
        {app.job_url && (
          <a href={app.job_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0">
            <ExternalLink size={14} /> View posting
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main column */}
        <div className="col-span-2 space-y-5">
          {/* Quick info chips */}
          <div className="flex flex-wrap gap-2">
            {app.work_type && (
              <Chip icon={<Briefcase size={13} />} label={app.work_type} />
            )}
            {app.location && (
              <Chip icon={<MapPin size={13} />} label={app.location} />
            )}
            {(app.salary_min || app.salary_max) && (
              <Chip icon={<DollarSign size={13} />}
                label={app.salary_min ? "$" + (app.salary_min/1000).toFixed(0) + "k" + (app.salary_max ? " – $" + (app.salary_max/1000).toFixed(0) + "k" : "+") : "Salary listed"} />
            )}
            {app.application_date && (
              <Chip icon={<Calendar size={13} />}
                label={"Applied " + new Date(app.application_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })} />
            )}
            {app.source && (
              <Chip icon={<Zap size={13} />} label={"via " + app.source} />
            )}
          </div>

          {/* Notes */}
          {app.notes && (
            <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">Notes</h2>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{app.notes}</p>
            </div>
          )}

          {/* Job description */}
          {app.job_description && (
            <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">Job description</h2>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{app.job_description}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">Timeline</h2>
            {app.events && app.events.length > 0 ? (
              <ol className="space-y-4">
                {app.events.map((ev, i) => (
                  <li key={ev.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {i < (app.events!.length - 1) && <div className="w-px flex-1 bg-white/[0.07] mt-1" />}
                    </div>
                    <div className="pb-4 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white">{ev.title}</p>
                        <span className="text-xs text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded capitalize">
                          {ev.event_type.replace(/_/g, " ")}
                        </span>
                      </div>
                      {ev.description && <p className="text-xs text-zinc-400 mt-1">{ev.description}</p>}
                      {ev.event_date && (
                        <p className="text-xs text-zinc-600 mt-1">
                          {new Date(ev.event_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-zinc-500 text-sm">No events logged yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Update status */}
          <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">Update status</h2>
            <UpdateStatusForm appId={app.id} currentStatus={app.status} />
          </div>

          {/* Meta */}
          <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">Info</h2>
            <Meta label="Priority">
              <span className={`text-sm font-medium capitalize ${PRIORITY_COLORS[app.priority]}`}>{app.priority}</span>
            </Meta>
            {excite > 0 && (
              <Meta label="Excitement">
                <span className="text-sm text-white">{"★".repeat(excite)}{"☆".repeat(5 - excite)}</span>
              </Meta>
            )}
            <Meta label="Added">
              <span className="text-sm text-zinc-300">
                {new Date(app.created_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </Meta>
            {app.deadline_date && (
              <Meta label="Deadline">
                <span className="text-sm text-red-400">
                  {new Date(app.deadline_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
              </Meta>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] text-zinc-300 text-xs px-2.5 py-1 rounded-md capitalize">
      <span className="text-zinc-500">{icon}</span>
      {label}
    </span>
  )
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </div>
  )
}
