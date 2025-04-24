import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { RowDataPacket } from "mysql2/promise"

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || "2024-01-01"
    const endDate = searchParams.get("endDate") || "2024-12-31"

    switch (type) {
      case "sales":
        const [sales] = await pool.query<RowDataPacket[]>(`
          SELECT 
            s.id, s.total as amount,
            p.name as productName, s.quantity,
            s.date as saleDate
          FROM sales s
          JOIN products p ON s.productId = p.id
          WHERE DATE(s.date) BETWEEN ? AND ?
          ORDER BY s.date DESC
        `, [startDate, endDate])
        return NextResponse.json(sales)

      case "inventory":
        const [inventory] = await pool.query<RowDataPacket[]>(`
          SELECT 
            p.name, p.category,
            i.quantity, i.reorderLevel,
            i.maxCapacity, i.lastRestock
          FROM inventory i
          JOIN products p ON i.productId = p.id
          ORDER BY p.category, p.name
        `)
        return NextResponse.json(inventory)

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}