import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT p.*, pr.name as productName
      FROM promotions p
      LEFT JOIN products pr ON p.productId = pr.id
      ORDER BY p.startDate DESC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const data = await request.json()

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO promotions (
        name, description, discountType, discountValue,
        applicableToAll, productId, category,
        startDate, endDate, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description,
        data.discountType,
        data.discountValue,
        data.applicableToAll || false,
        data.productId || null,
        data.category || null,
        data.startDate || null,
        data.endDate || null,
        data.isActive
      ]
    )

    await connection.commit()
    return NextResponse.json({ id: result.insertId, ...data })
  } catch (error) {
    await connection.rollback()
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
  } finally {
    connection.release()
  }
}