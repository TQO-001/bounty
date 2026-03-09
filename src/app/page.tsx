import Link from "next/link"
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{background:"var(--bg)"}}>
      <div className="inline-flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold text-lg" style={{background:"var(--amber)"}}>B</div>
        <span className="text-3xl font-bold" style={{color:"var(--text)"}}>Bounty</span>
      </div>
      <h1 className="text-4xl font-bold mb-4 max-w-md" style={{color:"var(--text)"}}>Your job search, organised.</h1>
      <p className="text-lg mb-10 max-w-sm" style={{color:"var(--muted-2)"}}>Track every application — from wishlist to offer — with a Kanban board, calendar, and more.</p>
      <div className="flex gap-4">
        <Link href="/register" className="px-6 py-3 rounded-xl text-sm font-semibold text-black" style={{background:"var(--amber)"}}>Get started free</Link>
        <Link href="/login" className="px-6 py-3 rounded-xl text-sm font-medium" style={{border:"1px solid var(--border-2)",color:"var(--muted-2)"}}>Sign in</Link>
      </div>
    </div>
  )
}
