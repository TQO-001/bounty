import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getContactsByUserId, createContact } from "@/lib/db/queries/contacts"

export async function GET() {
  try {
    const user = await requireAuth()
    const contacts = await getContactsByUserId(user.userId)
    return NextResponse.json(contacts)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const data = await request.json()
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    const contact = await createContact(user.userId, data)
    return NextResponse.json(contact, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
