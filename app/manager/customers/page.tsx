<<<<<<< HEAD
// "use client"

// import { useEffect, useState } from "react"
// import ManagerLayout from "@/components/layouts/manager-layout"
// import {
//   Card, CardContent, CardHeader, CardTitle
// } from "@/components/ui/card"
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { toast } from "@/components/ui/use-toast"

// interface Product {
//   id: string
//   name: string
//   category: string
//   price: number
// }

// const mockProducts: Product[] = [
//   { id: "P001", name: "Milk", category: "Dairy", price: 30.0 },
//   { id: "P002", name: "Chicken", category: "Meat", price: 120.0 },
//   { id: "P003", name: "Bread", category: "Bakery", price: 25.0 },
// ]

// export default function ManagerPricing() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
//   const [newPrice, setNewPrice] = useState("")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   useEffect(() => {
//     // Replace with real API call like: getProducts()
//     setProducts(mockProducts)
//   }, [])

//   const openPriceDialog = (product: Product) => {
//     setSelectedProduct(product)
//     setNewPrice(product.price.toString())
//     setIsDialogOpen(true)
//   }

//   const handlePriceUpdate = () => {
//     if (!selectedProduct || isNaN(Number(newPrice))) {
//       toast({ title: "Error", description: "Invalid price entered.", variant: "destructive" })
//       return
//     }

//     const updatedProducts = products.map((p) =>
//       p.id === selectedProduct.id ? { ...p, price: parseFloat(newPrice) } : p
//     )

//     setProducts(updatedProducts)
//     toast({ title: "Success", description: "Price updated successfully." })
//     setIsDialogOpen(false)
//   }

//   return (
//     <ManagerLayout>
//       <div className="container py-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Pricing Management</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product ID</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {products.map((product) => (
//                   <TableRow key={product.id}>
//                     <TableCell>{product.id}</TableCell>
//                     <TableCell>{product.name}</TableCell>
//                     <TableCell>{product.category}</TableCell>
//                     <TableCell>${product.price.toFixed(2)}</TableCell>
//                     <TableCell>
//                       <Button size="sm" onClick={() => openPriceDialog(product)}>Update</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogContent className="sm:max-w-[400px]">
//                 <DialogHeader>
//                   <DialogTitle>Update Price</DialogTitle>
//                 </DialogHeader>
//                 {selectedProduct && (
//                   <div className="space-y-4 py-2">
//                     <div>
//                       <Label>Product</Label>
//                       <p className="font-medium">{selectedProduct.name} ({selectedProduct.id})</p>
//                     </div>
//                     <div>
//                       <Label htmlFor="new-price">New Price</Label>
//                       <Input
//                         id="new-price"
//                         type="number"
//                         value={newPrice}
//                         onChange={(e) => setNewPrice(e.target.value)}
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                   </div>
//                 )}
//                 <DialogFooter>
//                   <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                   <Button onClick={handlePriceUpdate}>Update Price</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </CardContent>
//         </Card>
//       </div>
//     </ManagerLayout>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getCustomers, updateCustomerCredits } from "@/lib/api"

export default function ManagerCustomers() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCredits, setEditCredits] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (customer: any) => {
    setEditingId(customer.id)
    setEditCredits(customer.credits?.toString() || "")
  }

  const handleSave = async (customerId: string) => {
    try {
      await updateCustomerCredits(customerId, Number(editCredits))
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, credits: Number(editCredits) } : c))
      )
      setEditingId(null)
      toast({ title: "Credits updated successfully." })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update credits.",
        variant: "destructive",
      })
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toString().includes(searchTerm)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 max-w-md"
        />
        {isLoading ? (
          <div className="text-center py-8">Loading customers...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {editingId === customer.id ? (
                        <Input
                          type="number"
                          value={editCredits}
                          onChange={(e) => setEditCredits(e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        customer.credits
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === customer.id ? (
                        <Button size="sm" onClick={() => handleSave(customer.id)}>
                          Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
=======
"use client"

import { useEffect, useState } from "react"
import ManagerLayout from "@/components/layouts/manager-layout"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  category: string
  price: number
}

const mockProducts: Product[] = [
  { id: "P001", name: "Milk", category: "Dairy", price: 30.0 },
  { id: "P002", name: "Chicken", category: "Meat", price: 120.0 },
  { id: "P003", name: "Bread", category: "Bakery", price: 25.0 },
]

export default function ManagerPricing() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newPrice, setNewPrice] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Replace with real API call like: getProducts()
    setProducts(mockProducts)
  }, [])

  const openPriceDialog = (product: Product) => {
    setSelectedProduct(product)
    setNewPrice(product.price.toString())
    setIsDialogOpen(true)
  }

  const handlePriceUpdate = () => {
    if (!selectedProduct || isNaN(Number(newPrice))) {
      toast({ title: "Error", description: "Invalid price entered.", variant: "destructive" })
      return
    }

    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id ? { ...p, price: parseFloat(newPrice) } : p
    )

    setProducts(updatedProducts)
    toast({ title: "Success", description: "Price updated successfully." })
    setIsDialogOpen(false)
  }

  return (
    <ManagerLayout>
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => openPriceDialog(product)}>Update</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Update Price</DialogTitle>
                </DialogHeader>
                {selectedProduct && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label>Product</Label>
                      <p className="font-medium">{selectedProduct.name} ({selectedProduct.id})</p>
                    </div>
                    <div>
                      <Label htmlFor="new-price">New Price</Label>
                      <Input
                        id="new-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handlePriceUpdate}>Update Price</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  )
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
