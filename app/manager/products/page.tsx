"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { pool } from "@/lib/db"
import { ResultSetHeader, RowDataPacket } from "mysql2/promise"

export default function ManagerProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    unitAvailable: "",
    location: "",
    floatDiscount: "0",
    minThreshold: "10",
    maxCapacity: "100"
  })

  const fetchProducts = async () => {
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
      setProducts(rows)
    } catch (error) {
      toast({
        title: "Error fetching products",
        description: String(error),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEdit = (product: any) => {
    setIsEditMode(true)
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      unitAvailable: String(product.unitAvailable || 0),
      location: product.location || "",
      floatDiscount: String(product.floatDiscount || 0),
      minThreshold: String(product.minThreshold || 10),
      maxCapacity: String(product.maxCapacity || 100)
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      // Delete from inventory first due to foreign key constraints
      await connection.query('DELETE FROM inventory WHERE productId = ?', [id])
      
      // Then delete from products
      await connection.query('DELETE FROM products WHERE id = ?', [id])

      await connection.commit()
      setProducts(products.filter(p => p.id !== id))
      toast({ title: "Product deleted successfully" })
    } catch (error) {
      await connection.rollback()
      toast({
        title: "Error deleting product",
        description: String(error),
        variant: "destructive"
      })
    } finally {
      connection.release()
    }
  }

  const handleSubmit = async () => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      if (isEditMode) {
        // Update product
        await connection.query(
          `UPDATE products 
           SET name = ?, category = ?, price = ?, floatDiscount = ?
           WHERE id = ?`,
          [
            formData.name,
            formData.category,
            parseFloat(formData.price),
            parseFloat(formData.floatDiscount),
            formData.id
          ]
        )

        // Update inventory
        await connection.query(
          `UPDATE inventory 
           SET quantity = ?, location = ?, reorderLevel = ?, maxCapacity = ?
           WHERE productId = ?`,
          [
            parseInt(formData.unitAvailable),
            formData.location,
            parseInt(formData.minThreshold),
            parseInt(formData.maxCapacity),
            formData.id
          ]
        )
      } else {
        // Generate new product ID
        const [lastProduct] = await connection.query<RowDataPacket[]>(
          'SELECT id FROM products ORDER BY id DESC LIMIT 1'
        )
        const nextId = lastProduct[0] 
          ? `PRD${String(Number(lastProduct[0].id.slice(3)) + 1).padStart(3, '0')}`
          : 'PRD001'

        // Insert new product
        await connection.query(
          `INSERT INTO products (id, name, category, price, floatDiscount)
           VALUES (?, ?, ?, ?, ?)`,
          [
            nextId,
            formData.name,
            formData.category,
            parseFloat(formData.price),
            parseFloat(formData.floatDiscount)
          ]
        )

        // Create inventory record
        await connection.query(
          `INSERT INTO inventory (productId, quantity, location, reorderLevel, maxCapacity)
           VALUES (?, ?, ?, ?, ?)`,
          [
            nextId,
            parseInt(formData.unitAvailable),
            formData.location,
            parseInt(formData.minThreshold),
            parseInt(formData.maxCapacity)
          ]
        )
      }

      await connection.commit()
      fetchProducts() // Refresh the product list
      setIsDialogOpen(false)
      resetForm()
      toast({ 
        title: `Product ${isEditMode ? 'updated' : 'created'} successfully` 
      })
    } catch (error) {
      await connection.rollback()
      toast({
        title: `Error ${isEditMode ? 'updating' : 'creating'} product`,
        description: String(error),
        variant: "destructive"
      })
    } finally {
      connection.release()
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      price: "",
      unitAvailable: "",
      location: "",
      floatDiscount: "0",
      minThreshold: "10",
      maxCapacity: "100"
    })
    setIsEditMode(false)
  }

  const getStatus = (quantity: number, threshold: number) => {
    if (quantity === undefined || threshold === undefined) {
      return { text: "Unknown", class: "bg-gray-50 text-gray-700 border-gray-200" }
    }
    if (quantity <= 0) {
      return { text: "Out of Stock", class: "bg-red-50 text-red-700 border-red-200" }
    }
    if (quantity <= threshold) {
      return { text: "Low Stock", class: "bg-yellow-50 text-yellow-700 border-yellow-200" }
    }
    return { text: "In Stock", class: "bg-green-50 text-green-700 border-green-200" }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Product Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProducts}>Refresh</Button>
          <Button onClick={() => {
            setIsEditMode(false)
            resetForm()
            setIsDialogOpen(true)
          }}>
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const status = getStatus(product.unitAvailable, product.minThreshold)
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>{product.unitAvailable}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.class}>
                        {status.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="unitAvailable">Stock Quantity</Label>
                <Input id="unitAvailable" name="unitAvailable" type="number" value={formData.unitAvailable} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="floatDiscount">Discount (%)</Label>
                <Input id="floatDiscount" name="floatDiscount" type="number" step="0.01" value={formData.floatDiscount} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="minThreshold">Reorder Threshold</Label>
                <Input id="minThreshold" name="minThreshold" type="number" value={formData.minThreshold} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input id="maxCapacity" name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}