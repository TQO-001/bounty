import { STATUS_LABELS, STATUS_COLORS, type ApplicationStatus } from "@/types"

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
