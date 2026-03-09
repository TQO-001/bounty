import { getAuthUser } from "@/lib/auth"
import { getDashboardStats } from "@/lib/db/queries/applications"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Briefcase, TrendingUp, Star, Award } from "lucide-react"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect("/login")
  const stats = await getDashboardStats(user.userId)
  const cards = [
    { label: "Total applications", value: stats.total, icon: Briefcase, href: "/applications", color: "#f59e0b" },
    { label: "Active pipeline", value: stats.active, icon: TrendingUp, href: "/applications", color: "#93c5fd" },
    { label: "Response rate", value: stats.response_rate + "%", icon: Star, href: "/applications?status=interview", color: "#c4b5fd" },
    { label: "Offer rate", value: stats.offer_rate + "%", icon: Award, href: "/applications?status=offer", color: "#34d399" },
  ]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{greeting}, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-2)" }}>Here's your job search at a glance.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.href} className="rounded-xl p-5 block transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor="var(--amber-border)")}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor="var(--border)")}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: c.color+"1a", color: c.color }}><c.icon size={18}/></div>
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap">
        <Link href="/applications" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-black" style={{ background: "var(--amber)" }}>Open Job Board</Link>
        <Link href="/calendar" className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border-2)", color: "var(--muted-2)" }}>Calendar</Link>
        <Link href="/documents" className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border-2)", color: "var(--muted-2)" }}>Documents</Link>
      </div>
    </div>
  )
}
