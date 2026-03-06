"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, User, LogOut, TrendingUp } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/contacts", label: "Contacts", icon: Users },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-[#111111] border-r border-white/[0.06] flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <span className="text-base font-bold text-amber-400">Bounty</span>
        <p className="text-xs text-zinc-500 mt-0.5">Job Tracker</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={16} className={active ? "text-amber-400" : ""} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-3 py-4 space-y-0.5">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/profile"
              ? "bg-amber-500/10 text-amber-400"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <User size={16} />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      {/* User chip */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <p className="text-xs text-zinc-500 truncate">Signed in as</p>
        <p className="text-xs font-medium text-zinc-300 truncate mt-0.5">{userName}</p>
      </div>
    </aside>
  )
}
