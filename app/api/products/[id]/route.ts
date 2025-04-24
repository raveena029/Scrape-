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

// Mock product database
const products = [
  {
    id: 1,
    name: "Milk",
    description: "Fresh whole milk",
    price: 3.99,
    category: "Dairy",
    barcode: "123456789",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Bread",
    description: "Whole wheat bread",
    price: 2.49,
    category: "Bakery",
    barcode: "987654321",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Eggs",
    description: "Farm fresh eggs",
    price: 4.99,
    category: "Dairy",
    barcode: "456789123",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Apples",
    description: "Red delicious apples",
    price: 1.99,
    category: "Produce",
    barcode: "789123456",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Chicken",
    description: "Boneless chicken breast",
    price: 8.99,
    category: "Meat",
    barcode: "321654987",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updatedProduct = await request.json()

    // In a real application, you would update the database here
    // For now, we'll just return the updated product
    return NextResponse.json({ ...updatedProduct, id })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // In a real application, you would delete from the database here
    // For now, we'll just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 })
  }
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
