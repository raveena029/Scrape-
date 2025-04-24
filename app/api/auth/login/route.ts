import { NextResponse } from "next/server"
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