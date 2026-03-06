import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen bg-[#0c0c0c]">
      <Sidebar userName={user.name} />
      <main className="ml-[220px] flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
