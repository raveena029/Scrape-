import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        p.*,
        i.quantity as unitAvailable,
        i.location,
        i.reorderLevel as minThreshold,
        i.maxCapacity
      FROM products p
      LEFT JOIN inventory i ON p.id = i.productId
      ORDER BY p.name
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}