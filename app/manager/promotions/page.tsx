// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/components/ui/use-toast"
// import { getPromotions, createPromotion, getProducts } from "@/lib/api"

// export default function ManagerPromotions() {
//   const { toast } = useToast()
//   const [promotions, setPromotions] = useState<any[]>([])
//   const [products, setProducts] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     discountType: "percentage",
//     discountValue: "",
//     applicableToAll: false,
//     productId: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//     isActive: true,
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       // Fetch promotions
//       const promotionsData = await getPromotions()
//       setPromotions(Array.isArray(promotionsData) ? promotionsData : [])

//       // Fetch products
//       try {
//         const productsData = await getProducts()
//         setProducts(Array.isArray(productsData) ? productsData : [])
//       } catch (productError) {
//         console.error("Error fetching products:", productError)
//         // Don't fail the whole page if products can't be fetched
//         setProducts([])
//       }
//     } catch (error: any) {
//       console.error("Error fetching data:", error)
//       setError(error.message || "Failed to fetch promotions data")
//       toast({
//         title: "Error",
//         description: "Failed to fetch promotions data. Please try again.",
//         variant: "destructive",
//       })
//       // Set empty arrays to prevent undefined errors
//       setPromotions([])
//       setProducts([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSwitchChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }))
//   }

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       discountType: "percentage",
//       discountValue: "",
//       applicableToAll: false,
//       productId: "",
//       category: "",
//       startDate: "",
//       endDate: "",
//       isActive: true,
//     })
//   }

//   const handleAddPromotion = () => {
//     resetForm()
//     setIsDialogOpen(true)
//   }

//   const handleSubmit = async () => {
//     // Validate form
//     if (!formData.name || !formData.discountValue) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsProcessing(true)
//     try {
//       const promotionData = {
//         ...formData,
//         discountValue: Number.parseFloat(formData.discountValue),
//       }

//       const result = await createPromotion(promotionData)

//       if (result && !result.error) {
//         // Update local state
//         setPromotions([...promotions, result])

//         toast({
//           title: "Success",
//           description: "Promotion created successfully.",
//         })

//         setIsDialogOpen(false)
//         resetForm()
//       } else {
//         throw new Error(result.error || "Failed to create promotion")
//       }
//     } catch (error: any) {
//       console.error("Error creating promotion:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to create promotion. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleRetry = () => {
//     fetchData()
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>Promotions Management</CardTitle>
//           <Button onClick={handleAddPromotion}>Add New Promotion</Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="text-center py-8">Loading promotions...</div>
//         ) : error ? (
//           <div className="text-center py-8">
//             <p className="text-red-500 mb-4">{error}</p>
//             <Button onClick={handleRetry}>Retry</Button>
//           </div>
//         ) : promotions.length > 0 ? (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Discount</TableHead>
//                 <TableHead>Applicable To</TableHead>
//                 <TableHead>Valid Period</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {promotions.map((promotion) => (
//                 <TableRow key={promotion.id || `promotion-${Math.random()}`}>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{promotion.name || "Unnamed Promotion"}</div>
//                       <div className="text-sm text-gray-500">{promotion.description || "No description"}</div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {promotion.discountType === "percentage"
//                       ? `${promotion.discountValue || 0}%`
//                       : `$${(promotion.discountValue || 0).toFixed(2)}`}
//                   </TableCell>
//                   <TableCell>
//                     {promotion.applicableToAll
//                       ? "All Products"
//                       : promotion.productId
//                         ? `Product: ${products.find((p) => p.id === promotion.productId)?.name || promotion.productId}`
//                         : promotion.category
//                           ? `Category: ${promotion.category}`
//                           : "Not specified"}
//                   </TableCell>
//                   <TableCell>
//                     {promotion.startDate && promotion.endDate
//                       ? `${new Date(promotion.startDate).toLocaleDateString()} - ${new Date(promotion.endDate).toLocaleDateString()}`
//                       : "No expiration"}
//                   </TableCell>
//                   <TableCell>
//                     <div
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         promotion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {promotion.isActive ? "Active" : "Inactive"}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             No promotions found. Create a new promotion to get started.
//           </div>
//         )}

//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Add New Promotion</DialogTitle>
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
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="discountType" className="text-right">
//                   Discount Type
//                 </Label>
//                 <Select
//                   value={formData.discountType}
//                   onValueChange={(value) => handleSelectChange("discountType", value)}
//                 >
//                   <SelectTrigger id="discountType" className="col-span-3">
//                     <SelectValue placeholder="Select discount type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="percentage">Percentage (%)</SelectItem>
//                     <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="discountValue" className="text-right">
//                   Discount Value*
//                 </Label>
//                 <Input
//                   id="discountValue"
//                   name="discountValue"
//                   type="number"
//                   min="0"
//                   step={formData.discountType === "percentage" ? "1" : "0.01"}
//                   value={formData.discountValue}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="applicableToAll" className="text-right">
//                   Apply to All Products
//                 </Label>
//                 <div className="col-span-3 flex items-center space-x-2">
//                   <Switch
//                     id="applicableToAll"
//                     checked={formData.applicableToAll}
//                     onCheckedChange={(checked) => handleSwitchChange("applicableToAll", checked)}
//                   />
//                   <Label htmlFor="applicableToAll">{formData.applicableToAll ? "Yes" : "No"}</Label>
//                 </div>
//               </div>

//               {!formData.applicableToAll && (
//                 <>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="productId" className="text-right">
//                       Product
//                     </Label>
//                     <Select
//                       value={formData.productId}
//                       onValueChange={(value) => handleSelectChange("productId", value)}
//                       disabled={!!formData.category}
//                     >
//                       <SelectTrigger id="productId" className="col-span-3">
//                         <SelectValue placeholder="Select product (optional)" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="none">None</SelectItem>
//                         {products.map((product) => (
//                           <SelectItem key={product.id || `product-${Math.random()}`} value={product.id || ""}>
//                             {product.name || "Unnamed Product"}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="category" className="text-right">
//                       Category
//                     </Label>
//                     <Input
//                       id="category"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className="col-span-3"
//                       disabled={!!formData.productId && formData.productId !== "none"}
//                       placeholder="Enter category (optional)"
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="startDate" className="text-right">
//                   Start Date
//                 </Label>
//                 <Input
//                   id="startDate"
//                   name="startDate"
//                   type="date"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="endDate" className="text-right">
//                   End Date
//                 </Label>
//                 <Input
//                   id="endDate"
//                   name="endDate"
//                   type="date"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="isActive" className="text-right">
//                   Active
//                 </Label>
//                 <div className="col-span-3 flex items-center space-x-2">
//                   <Switch
//                     id="isActive"
//                     checked={formData.isActive}
//                     onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
//                   />
//                   <Label htmlFor="isActive">{formData.isActive ? "Yes" : "No"}</Label>
//                 </div>
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
//                 {isProcessing ? "Creating..." : "Create Promotion"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

<<<<<<< HEAD
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
=======
import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
import { useToast } from "@/components/ui/use-toast"
import { getPromotions, createPromotion, getProducts } from "@/lib/api"

export default function ManagerPromotions() {
  const { toast } = useToast()
  const [promotions, setPromotions] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
<<<<<<< HEAD
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
=======
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
<<<<<<< HEAD
    productId: "",
=======
    applicableToAll: false,
    productId: "",
    category: "",
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
    startDate: "",
    endDate: "",
    isActive: true,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
<<<<<<< HEAD
    try {
      const promoData = await getPromotions()
      setPromotions(promoData)
      const prodData = await getProducts()
      setProducts(prodData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch promotions or products.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        isActive: Boolean(formData.isActive),
      }
      await createPromotion(data)
      toast({ title: "Promotion created successfully." })
      setIsDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        productId: "",
        startDate: "",
        endDate: "",
        isActive: true,
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create promotion.",
        variant: "destructive",
      })
    }
=======
    setIsLoading(true)
    setError(null)
    try {
      // Fetch promotions
      const promotionsData = await getPromotions()
      setPromotions(Array.isArray(promotionsData) ? promotionsData : [])

      // Fetch products
      try {
        const productsData = await getProducts()
        setProducts(Array.isArray(productsData) ? productsData : [])
      } catch (productError) {
        console.error("Error fetching products:", productError)
        // Don't fail the whole page if products can't be fetched
        setProducts([])
      }
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.message || "Failed to fetch promotions data")
      toast({
        title: "Error",
        description: "Failed to fetch promotions data. Please try again.",
        variant: "destructive",
      })
      // Set empty arrays to prevent undefined errors
      setPromotions([])
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      applicableToAll: false,
      productId: "",
      category: "",
      startDate: "",
      endDate: "",
      isActive: true,
    })
  }

  const handleAddPromotion = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.discountValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const promotionData = {
        ...formData,
        discountValue: Number.parseFloat(formData.discountValue),
      }

      const result = await createPromotion(promotionData)

      if (result && !result.error) {
        // Update local state
        setPromotions([...promotions, result])

        toast({
          title: "Success",
          description: "Promotion created successfully.",
        })

        setIsDialogOpen(false)
        resetForm()
      } else {
        throw new Error(result.error || "Failed to create promotion")
      }
    } catch (error: any) {
      console.error("Error creating promotion:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create promotion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = () => {
    fetchData()
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
  }

  return (
    <Card>
<<<<<<< HEAD
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Promotions</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>Add Promotion</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>{promo.name}</TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell>
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue}`}
                  </TableCell>
                  <TableCell>
                    {products.find((p) => p.id === promo.productId)?.name || "All"}
                  </TableCell>
                  <TableCell>{promo.startDate}</TableCell>
                  <TableCell>{promo.endDate}</TableCell>
                  <TableCell>
                    {promo.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No promotions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Promotion</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discountValue">Discount Value</Label>
=======
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Promotions Management</CardTitle>
          <Button onClick={handleAddPromotion}>Add New Promotion</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading promotions...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={handleRetry}>Retry</Button>
          </div>
        ) : promotions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id || `promotion-${Math.random()}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{promotion.name || "Unnamed Promotion"}</div>
                      <div className="text-sm text-gray-500">{promotion.description || "No description"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {promotion.discountType === "percentage"
                      ? `${promotion.discountValue || 0}%`
                      : `$${(promotion.discountValue || 0).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {promotion.applicableToAll
                      ? "All Products"
                      : promotion.productId
                        ? `Product: ${products.find((p) => p.id === promotion.productId)?.name || promotion.productId}`
                        : promotion.category
                          ? `Category: ${promotion.category}`
                          : "Not specified"}
                  </TableCell>
                  <TableCell>
                    {promotion.startDate && promotion.endDate
                      ? `${new Date(promotion.startDate).toLocaleDateString()} - ${new Date(promotion.endDate).toLocaleDateString()}`
                      : "No expiration"}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        promotion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {promotion.isActive ? "Active" : "Inactive"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No promotions found. Create a new promotion to get started.
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Promotion</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountType" className="text-right">
                  Discount Type
                </Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleSelectChange("discountType", value)}
                >
                  <SelectTrigger id="discountType" className="col-span-3">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountValue" className="text-right">
                  Discount Value*
                </Label>
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
<<<<<<< HEAD
                  value={formData.discountValue}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="productId">Product</Label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
=======
                  min="0"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicableToAll" className="text-right">
                  Apply to All Products
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="applicableToAll"
                    checked={formData.applicableToAll}
                    onCheckedChange={(checked) => handleSwitchChange("applicableToAll", checked)}
                  />
                  <Label htmlFor="applicableToAll">{formData.applicableToAll ? "Yes" : "No"}</Label>
                </div>
              </div>

              {!formData.applicableToAll && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productId" className="text-right">
                      Product
                    </Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) => handleSelectChange("productId", value)}
                      disabled={!!formData.category}
                    >
                      <SelectTrigger id="productId" className="col-span-3">
                        <SelectValue placeholder="Select product (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product.id || `product-${Math.random()}`} value={product.id || ""}>
                            {product.name || "Unnamed Product"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="col-span-3"
                      disabled={!!formData.productId && formData.productId !== "none"}
                      placeholder="Enter category (optional)"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
<<<<<<< HEAD
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
=======
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
<<<<<<< HEAD
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create</Button>
=======
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">{formData.isActive ? "Yes" : "No"}</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? "Creating..." : "Create Promotion"}
              </Button>
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
