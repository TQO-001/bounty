export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold" style={{ background: "var(--amber)" }}>B</div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>Bounty</span>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Your job search, organised.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
