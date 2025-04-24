import { NextResponse } from "next/server"
<<<<<<< HEAD
import { pool } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()
    
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT id, username, fullName, role, lastLogin 
       FROM users 
       WHERE username = ? AND password = ? AND role = ?`,
      [username, password, role]
    )

    if (users[0]) {
      await pool.query(
        'UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
        [users[0].id]
      )

      return NextResponse.json({
        success: true,
        user: {
          id: users[0].id,
          username: users[0].username,
          fullName: users[0].fullName,
          role: users[0].role,
          lastLogin: users[0].lastLogin
        }
      })
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" }, 
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
=======

// Mock user database
const users = [
  { id: 1, username: "employee1", password: "password123", role: "employee" },
  { id: 2, username: "manager1", password: "password123", role: "manager" },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    // Find user in mock database
    const user = users.find((u) => u.username === username && u.password === password && u.role === role)

    if (user) {
      // In a real application, you would generate a JWT token here
      return NextResponse.json({
        success: true,
        token: "mock-jwt-token",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      })
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
