import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/db/queries/users"

export async function GET() {
  try {
    const auth = await requireAuth()
    const user = await getUserById(auth.userId)
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth()
    const data = await request.json()
    const user = await updateUser(auth.userId, data)
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
