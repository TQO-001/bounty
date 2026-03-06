import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

    const users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`
    if (users.length === 0) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const user = users[0]
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const token = await createToken(user)
    await setAuthCookie(token)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
