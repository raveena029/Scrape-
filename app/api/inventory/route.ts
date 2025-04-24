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
=======

// Mock inventory database
const inventory = [
  { id: 1, productId: 1, quantity: 100, location: "A1", reorderLevel: 20 },
  { id: 2, productId: 2, quantity: 50, location: "B2", reorderLevel: 10 },
  { id: 3, productId: 3, quantity: 75, location: "C3", reorderLevel: 15 },
  { id: 4, productId: 4, quantity: 200, location: "D4", reorderLevel: 30 },
  { id: 5, productId: 5, quantity: 30, location: "E5", reorderLevel: 5 },
]

export async function GET() {
  // Simulate a slight delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(inventory)
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
}

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
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
    const inventoryItem = await request.json()

    // In a real application, you would save to a database here
    // For now, we'll just return the inventory item with a new ID
    const newInventoryItem = {
      ...inventoryItem,
      id: inventory.length + 1,
    }

    return NextResponse.json(newInventoryItem)
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ success: false, message: "Failed to create inventory item" }, { status: 500 })
  }
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
