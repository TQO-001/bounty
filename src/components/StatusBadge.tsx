import type { ApplicationStatus } from "@/types"
import { STATUS_LABELS } from "@/types"
const COLORS: Record<ApplicationStatus,{bg:string;color:string}> = {
  wishlist:{bg:"rgba(113,113,122,.15)",color:"#a1a1aa"},applied:{bg:"rgba(59,130,246,.15)",color:"#93c5fd"},
  phone_screen:{bg:"rgba(245,158,11,.15)",color:"#fbbf24"},interview:{bg:"rgba(167,139,250,.15)",color:"#c4b5fd"},
  offer:{bg:"rgba(52,211,153,.15)",color:"#34d399"},rejected:{bg:"rgba(239,68,68,.15)",color:"#f87171"},
  withdrawn:{bg:"rgba(251,146,60,.15)",color:"#fb923c"},ghosted:{bg:"rgba(100,116,139,.15)",color:"#94a3b8"},
}
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const c = COLORS[status]
  return <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ background: c.bg, color: c.color }}>{STATUS_LABELS[status]}</span>
}
