import { NextResponse } from "next/server"
<<<<<<< HEAD
import { pool } from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        c.*,
        COUNT(s.id) as totalOrders,
        SUM(s.total) as totalSpent,
        MAX(s.saleDate) as lastOrder
      FROM customers c
      LEFT JOIN sales s ON c.id = s.customerId
      GROUP BY c.id
      ORDER BY c.fullName
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO customers (
        fullName, email, phone, 
        address, membershipLevel, 
        creditBalance
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.fullName,
        data.email,
        data.phone,
        data.address,
        data.membershipLevel || 'regular',
        data.creditBalance || 0
      ]
    )
    return NextResponse.json({ id: result.insertId, ...data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
=======

// Mock customer database
const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", credits: 50 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", credits: 25 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "555-123-4567", credits: 75 },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const customer = customers.find((c) => c.id === id)

  if (!customer) {
    return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 })
  }

  return NextResponse.json(customer)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updatedCustomer = await request.json()

    // In a real application, you would update the database here
    // For now, we'll just return the updated customer
    return NextResponse.json({ ...updatedCustomer, id })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ success: false, message: "Failed to update customer" }, { status: 500 })
  }
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
