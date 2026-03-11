import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold clay-sm"
            style={{ background: "var(--amber)" }}>B</div>
          <span className="font-bold text-lg" style={{ color: "var(--text)" }}>Bounty</span>
        </Link>
        <p className="text-center text-sm mb-8" style={{ color: "var(--muted-2)" }}>
          Your job search, organised.
        </p>
        {children}
      </div>
    </div>
  )
}
