import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getApplicationsByUserId, createApplication } from "@/lib/db/queries/applications"

export async function GET() {
  try {
    const user = await requireAuth()
    const apps = await getApplicationsByUserId(user.userId)
    return NextResponse.json(apps)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const data = await request.json()
    if (!data.company_name || !data.job_title) {
      return NextResponse.json({ error: "Company and job title are required" }, { status: 400 })
    }
    const app = await createApplication(user.userId, data)
    return NextResponse.json(app, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
