// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
// import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api"

// export default function ManagerProducts() {
//   const { toast } = useToast()
//   const [products, setProducts] = useState<any[]>([])
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     category: "",
//     price: "",
//     description: "",
//     discount: "0",
//   })

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredProducts(products)
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase()
//       const filtered = products.filter(
//         (product) =>
//           product.id.toString().includes(lowercaseSearch) ||
//           product.name.toLowerCase().includes(lowercaseSearch) ||
//           product.category.toLowerCase().includes(lowercaseSearch),
//       )
//       setFilteredProducts(filtered)
//     }
//   }, [searchTerm, products])

//   const fetchProducts = async () => {
//     setIsLoading(true)
//     try {
//       const data = await getProducts()
//       setProducts(data)
//       setFilteredProducts(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch products. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const resetForm = () => {
//     setFormData({
//       id: "",
//       name: "",
//       category: "",
//       price: "",
//       description: "",
//       discount: "0",
//     })
//     setIsEditMode(false)
//   }

//   const handleAddNew = () => {
//     resetForm()
//     setIsDialogOpen(true)
//   }

//   const handleEdit = (product: any) => {
//     setFormData({
//       id: product.id,
//       name: product.name,
//       category: product.category,
//       price: product.price.toString(),
//       description: product.description || "",
//       discount: product.discount ? product.discount.toString() : "0",
//     })
//     setIsEditMode(true)
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (productId: string) => {
//     if (!confirm("Are you sure you want to delete this product?")) {
//       return
//     }

//     try {
//       await deleteProduct(productId)

//       // Update local state
//       const updatedProducts = products.filter((p) => p.id !== productId)
//       setProducts(updatedProducts)
//       setFilteredProducts(updatedProducts)

//       toast({
//         title: "Success",
//         description: "Product deleted successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete product. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmit = async () => {
//     // Validate form
//     if (!formData.name || !formData.category || !formData.price) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsProcessing(true)
//     try {
//       const productData = {
//         ...formData,
//         price: Number.parseFloat(formData.price),
//         discount: Number.parseFloat(formData.discount || "0"),
//       }

//       let result
//       if (isEditMode) {
//         result = await updateProduct(formData.id, productData)

//         // Update local state
//         const updatedProducts = products.map((p) => (p.id === result.id ? result : p))
//         setProducts(updatedProducts)
//         setFilteredProducts(updatedProducts)

//         toast({
//           title: "Success",
//           description: "Product updated successfully.",
//         })
//       } else {
//         result = await createProduct(productData)

//         // Update local state
//         setProducts([...products, result])
//         setFilteredProducts([...filteredProducts, result])

//         toast({
//           title: "Success",
//           description: "Product created successfully.",
//         })
//       }

//       setIsDialogOpen(false)
//       resetForm()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${isEditMode ? "update" : "create"} product. Please try again.`,
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>Product Management</CardTitle>
//           <Button onClick={handleAddNew}>Add New Product</Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-6">
//           <Input
//             placeholder="Search by ID, name, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="max-w-md"
//           />
//         </div>

//         {isLoading ? (
//           <div className="text-center py-8">Loading products...</div>
//         ) : filteredProducts.length > 0 ? (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Discount</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredProducts.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell className="font-medium">{product.name}</TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>${product.price.toFixed(2)}</TableCell>
//                   <TableCell>{product.discount ? `${product.discount}%` : "-"}</TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="text-red-500 hover:text-red-700"
//                         onClick={() => handleDelete(product.id)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <div className="text-center py-8 text-gray-500">No products found matching your search.</div>
//         )}

//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">
//                   Name*
//                 </Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="category" className="text-right">
//                   Category*
//                 </Label>
//                 <Input
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="price" className="text-right">
//                   Price*
//                 </Label>
//                 <Input
//                   id="price"
//                   name="price"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="discount" className="text-right">
//                   Discount %
//                 </Label>
//                 <Input
//                   id="discount"
//                   name="discount"
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={formData.discount}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="description" className="text-right">
//                   Description
//                 </Label>
//                 <Input
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsDialogOpen(false)
//                   resetForm()
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit} disabled={isProcessing}>
//                 {isProcessing ? "Processing..." : isEditMode ? "Update" : "Create"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getProducts, createProduct, updateProduct, deleteProduct, updateInventory } from "@/lib/api"

export default function ManagerProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    category: "",
    price: "",
    unitAvailable: "",
    location: "",
    floatDiscount: "",
    minThreshold: "",
    maxCapacity: "",
  })

  const fetchData = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      toast({
        title: "Error fetching products",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEdit = (product: any) => {
    setIsEditMode(true)
    setFormData(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))  // instant UI update
      toast({ title: "✅ Product deleted successfully" })
    } catch (error) {
      console.error("❌ Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const updateInventoryForProduct = async (productId, quantity) => {
    try {
      await updateInventory(productId, parseInt(quantity));
      console.log(`Updated inventory for product ${productId} with quantity ${quantity}`);
    } catch (error) {
      console.error(`Failed to update inventory for product ${productId}:`, error);
      // Don't throw error here to allow product creation to continue
    }
  }

  const handleSubmit = async () => {
    try {
      // Ensure numeric fields are properly formatted
      const formattedData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        unitAvailable: formData.unitAvailable ? parseInt(formData.unitAvailable) : 0,
        floatDiscount: formData.floatDiscount ? parseFloat(formData.floatDiscount) : 0,
        minThreshold: formData.minThreshold ? parseInt(formData.minThreshold) : 0,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : 100
      };

      if (isEditMode) {
        const updatedProduct = await updateProduct(formattedData.id, formattedData)
        
        // Update inventory with new quantity if it changed
        const originalProduct = products.find(p => p.id === formattedData.id);
        if (originalProduct && originalProduct.unitAvailable !== formattedData.unitAvailable) {
          await updateInventoryForProduct(formattedData.id, formattedData.unitAvailable);
        }
        
        // Update local state immediately
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === formattedData.id ? updatedProduct : p)
        )
        toast({ title: "✅ Product updated" })
      } else {
        const newProduct = await createProduct(formattedData)
        
        // Also update inventory for this new product
        await updateInventoryForProduct(newProduct.id, formattedData.unitAvailable);
        
        // Add the new product to the local state immediately
        setProducts(prevProducts => [...prevProducts, newProduct])
        toast({ title: "✅ Product created" })
      }
      setIsDialogOpen(false)
      resetForm();
    } catch (error) {
      console.error("❌ Error submitting product:", error)
      toast({
        title: "Error submitting product",
        description: String(error),
        variant: "destructive",
      })
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
      floatDiscount: "",
      minThreshold: "",
      maxCapacity: "",
    })
  }

  // Determine status based on quantity and reorder level
  const getStatus = (quantity, threshold) => {
    if (quantity === undefined || threshold === undefined) {
      return { text: "Unknown", class: "bg-gray-50 text-gray-700 border-gray-200" };
    }
    
    if (quantity <= 0) {
      return { text: "Out of Stock", class: "bg-red-50 text-red-700 border-red-200" };
    }
    
    if (quantity <= threshold) {
      return { text: "Low Stock", class: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    }
    
    return { text: "In Stock", class: "bg-green-50 text-green-700 border-green-200" };
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Product Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setIsEditMode(false)
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
            {products.length > 0 ? (
              products.map((product) => {
                const status = getStatus(product.unitAvailable, product.minThreshold);
                
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
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}