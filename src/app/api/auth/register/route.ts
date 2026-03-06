import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`
    if (existing.length > 0) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

    const hash = await hashPassword(password)
    const users = await sql`
      INSERT INTO users (name, email, password_hash) VALUES (${name}, ${email.toLowerCase()}, ${hash}) RETURNING *
    `
    const user = users[0]
    const token = await createToken(user)
    await setAuthCookie(token)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
