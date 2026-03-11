import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg)" }}>

      {/* Logo */}
      <div className="inline-flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-black font-bold text-2xl clay"
          style={{ background: "var(--amber)" }}>B</div>
        <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Bounty</span>
      </div>

      <h1 className="text-5xl font-bold mb-5 max-w-lg leading-tight" style={{ color: "var(--text)" }}>
        Your job search,<br/>organised.
      </h1>
      <p className="text-lg mb-12 max-w-sm" style={{ color: "var(--muted-2)" }}>
        Track every application — from wishlist to offer — with a Kanban board, calendar, and more.
      </p>

      <div className="flex gap-4">
        <Link href="/register"
          className="px-7 py-3.5 text-sm font-bold text-black clay-lift clay-sm"
          style={{ background: "var(--amber)" }}>
          Get started free
        </Link>
        <Link href="/login"
          className="px-7 py-3.5 text-sm font-semibold clay-lift clay-sm"
          style={{ background: "var(--surface)", color: "var(--muted-2)" }}>
          Sign in
        </Link>
      </div>
    </div>
  )
}
