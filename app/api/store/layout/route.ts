import { NextResponse } from "next/server"
<<<<<<< HEAD
import { pool } from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    const [sections] = await pool.query<RowDataPacket[]>(`
      SELECT 
        s.*,
        COUNT(sp.productId) as productCount,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'aisle', sp.aisle,
            'shelf', sp.shelf
          )
        ) as products
      FROM store_sections s
      LEFT JOIN section_products sp ON s.id = sp.sectionId
      LEFT JOIN products p ON sp.productId = p.id
      GROUP BY s.id
      ORDER BY s.id
    `)

    // Parse the products JSON string for each section
    const formattedSections = sections.map(section => ({
      ...section,
      products: section.products ? JSON.parse(`[${section.products}]`) : []
    }))

    return NextResponse.json(formattedSections)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch layout' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const data = await request.json()

    // Insert or update section
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO store_sections (id, name, type, position) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       type = VALUES(type),
       position = VALUES(position)`,
      [data.id, data.name, data.type, data.position]
    )

    // Update product mappings if provided
    if (data.products?.length) {
      // First remove existing mappings
      await connection.query(
        'DELETE FROM section_products WHERE sectionId = ?',
        [data.id]
      )

      // Then add new mappings
      await Promise.all(data.products.map(async (product: any) => {
        await connection.query(
          `INSERT INTO section_products (sectionId, productId, aisle, shelf)
           VALUES (?, ?, ?, ?)`,
          [data.id, product.id, product.aisle, product.shelf]
        )
      }))
    }

    await connection.commit()
    return NextResponse.json({ 
      id: data.id,
      ...data,
      productCount: data.products?.length || 0
    })
  } catch (error) {
    await connection.rollback()
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update store layout' }, { status: 500 })
  } finally {
    connection.release()
  }
}

export async function DELETE(request: Request) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const data = await request.json()

    // First remove product mappings
    await connection.query(
      'DELETE FROM section_products WHERE sectionId = ?',
      [data.id]
    )

    // Then remove the section
    await connection.query(
      'DELETE FROM store_sections WHERE id = ?',
      [data.id]
    )

    await connection.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    await connection.rollback()
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  } finally {
    connection.release()
  }
}
export async function getStoreLayout() {
  const response = await fetch('/api/store/layout')
  if (!response.ok) throw new Error('Failed to fetch store layout')
  return response.json()
}

export async function updateStoreLayout(sectionId: string, data: any) {
  const response = await fetch('/api/store/layout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: sectionId,
      ...data
    })
  })
  if (!response.ok) throw new Error('Failed to update store layout')
  return response.json()
}

export async function deleteSection(sectionId: string) {
  const response = await fetch('/api/store/layout', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: sectionId })
  })
  if (!response.ok) throw new Error('Failed to delete section')
  return response.json()
}
=======

// Mock store layout
const storeLayout = {
  id: 1,
  name: "Main Store",
  sections: [
    {
      id: 1,
      name: "Produce",
      position: { x: 0, y: 0 },
      dimensions: { width: 3, height: 2 },
      products: [4],
    },
    {
      id: 2,
      name: "Dairy",
      position: { x: 3, y: 0 },
      dimensions: { width: 2, height: 2 },
      products: [1, 3],
    },
    {
      id: 3,
      name: "Bakery",
      position: { x: 0, y: 2 },
      dimensions: { width: 2, height: 1 },
      products: [2],
    },
    {
      id: 4,
      name: "Meat",
      position: { x: 2, y: 2 },
      dimensions: { width: 3, height: 1 },
      products: [5],
    },
    {
      id: 5,
      name: "Checkout",
      position: { x: 5, y: 0 },
      dimensions: { width: 1, height: 3 },
      products: [],
    },
  ],
}

export async function GET() {
  // Simulate a slight delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(storeLayout)
}

export async function PUT(request: Request) {
  try {
    const updatedLayout = await request.json()

    // In a real application, you would update the database here
    // For now, we'll just return the updated layout
    return NextResponse.json(updatedLayout)
  } catch (error) {
    console.error("Error updating store layout:", error)
    return NextResponse.json({ success: false, message: "Failed to update store layout" }, { status: 500 })
  }
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
