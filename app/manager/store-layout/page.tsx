<<<<<<< HEAD
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getStoreLayout, getProducts } from "@/lib/api"

const sectionTypes = [
  { id: 'A', name: 'Dairy', type: 'refrigerated', position: 'middle-left' },
  { id: 'B', name: 'Bakery', type: 'ambient', position: 'top-right' },
  { id: 'C', name: 'Produce', type: 'refrigerated', position: 'top-left' },
  { id: 'D', name: 'Meat', type: 'refrigerated', position: 'middle-right' },
  { id: 'E', name: 'Checkout', type: 'service', position: 'bottom' }
]

export default function StoreLayout() {
  const { toast } = useToast()
  const [sections, setSections] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    position: "",
    productId: "",
    aisle: "",
    shelf: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [layoutData, productsData] = await Promise.all([
        getStoreLayout(),
        getProducts()
      ])
      setSections(layoutData)
      setProducts(productsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store layout data",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async () => {
    try {
      // Insert directly into MySQL tables using the API
      const response = await fetch('/api/store/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update layout')
      
      toast({ title: "Layout updated successfully" })
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update layout",
        variant: "destructive"
      })
    }
  }

  // Add SQL table direct update function
  const updateSectionInDatabase = async (sectionId: string, data: any) => {
    try {
      const response = await fetch(`/api/store/layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sectionId,
          ...data
        })
      })

      if (!response.ok) throw new Error('Failed to update section')
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Layout Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your existing layout visualization */}
        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-[500px] text-lg font-medium text-center mb-10">
          {sectionTypes.map(section => (
            <div
              key={section.id}
              className={`border flex items-center justify-center transition-all duration-200 bg-white
                ${selectedSection === section.id ? "bg-blue-100" : ""}
              `}
              onClick={() => setSelectedSection(section.id)}
            >
              <div>
                <div className="text-2xl font-bold">{section.name}</div>
                <div className="text-sm text-gray-500">{section.id}</div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Section Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Aisle</Label>
                <Input 
                  value={formData.aisle}
                  onChange={(e) => setFormData({ ...formData, aisle: e.target.value })}
                />
              </div>

              <div>
                <Label>Shelf</Label>
                <Input 
                  value={formData.shelf}
                  onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
=======
// // "use client"

// // import type React from "react"

// // import { useState, useEffect } from "react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// // import { Label } from "@/components/ui/label"
// // import { Input } from "@/components/ui/input"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { toast } from "@/components/ui/use-toast"
// // import { getStoreLayout, getProducts } from "@/lib/api"

// // export default function ManagerStoreLayout() {
// //   const [storeLayout, setStoreLayout] = useState<any>(null)
// //   const [products, setProducts] = useState<any[]>([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [selectedSection, setSelectedSection] = useState<string | null>(null)
// //   const [isDialogOpen, setIsDialogOpen] = useState(false)
// //   const [editMode, setEditMode] = useState<"section" | "product" | null>(null)
// //   const [formData, setFormData] = useState({
// //     sectionId: "",
// //     sectionName: "",
// //     sectionType: "",
// //     productId: "",
// //     aisle: "",
// //   })

// //   useEffect(() => {
// //     fetchData()
// //   }, [])

// //   const fetchData = async () => {
// //     setIsLoading(true)
// //     try {
// //       const [layoutData, productsData] = await Promise.all([getStoreLayout(), getProducts()])

// //       setStoreLayout(layoutData)
// //       setProducts(productsData)
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to fetch data. Please try again.",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target
// //     setFormData((prev) => ({ ...prev, [name]: value }))
// //   }

// //   const handleSelectChange = (name: string, value: string) => {
// //     setFormData((prev) => ({ ...prev, [name]: value }))
// //   }

// //   const handleEditSection = (sectionId: string) => {
// //     const section = storeLayout.sections.find((s: any) => s.id === sectionId)
// //     if (!section) return

// //     setFormData({
// //       ...formData,
// //       sectionId: section.id,
// //       sectionName: section.name,
// //       sectionType: section.type,
// //     })

// //     setEditMode("section")
// //     setIsDialogOpen(true)
// //   }

// //   const handleAddProductToSection = (sectionId: string) => {
// //     setFormData({
// //       ...formData,
// //       sectionId,
// //       productId: "",
// //       aisle: "",
// //     })

// //     setEditMode("product")
// //     setIsDialogOpen(true)
// //   }

// //   const handleSubmit = async () => {
// //     // This would normally call an API to update the store layout
// //     // For now, we'll just simulate the update locally

// //     if (editMode === "section") {
// //       // Update section details
// //       const updatedSections = storeLayout.sections.map((section: any) => {
// //         if (section.id === formData.sectionId) {
// //           return {
// //             ...section,
// //             name: formData.sectionName,
// //             type: formData.sectionType,
// //           }
// //         }
// //         return section
// //       })

// //       setStoreLayout({
// //         ...storeLayout,
// //         sections: updatedSections,
// //       })

// //       toast({
// //         title: "Success",
// //         description: "Section updated successfully.",
// //       })
// //     } else if (editMode === "product") {
// //       // Add product to section
// //       const product = products.find((p) => p.id === formData.productId)
// //       if (!product) {
// //         toast({
// //           title: "Error",
// //           description: "Product not found.",
// //           variant: "destructive",
// //         })
// //         return
// //       }

// //       const updatedSections = storeLayout.sections.map((section: any) => {
// //         if (section.id === formData.sectionId) {
// //           const productEntry = {
// //             id: product.id,
// //             name: product.name,
// //             aisle: formData.aisle,
// //           }

// //           // Check if product already exists in this section
// //           const existingProductIndex = section.products
// //             ? section.products.findIndex((p: any) => p.id === product.id)
// //             : -1

// //           if (existingProductIndex >= 0) {
// //             // Update existing product
// //             const updatedProducts = [...section.products]
// //             updatedProducts[existingProductIndex] = productEntry
// //             return {
// //               ...section,
// //               products: updatedProducts,
// //             }
// //           } else {
// //             // Add new product
// //             return {
// //               ...section,
// //               products: [...(section.products || []), productEntry],
// //             }
// //           }
// //         }
// //         return section
// //       })

// //       setStoreLayout({
// //         ...storeLayout,
// //         sections: updatedSections,
// //       })

// //       toast({
// //         title: "Success",
// //         description: "Product added to section successfully.",
// //       })
// //     }

// //     setIsDialogOpen(false)
// //   }

// //   if (isLoading) {
// //     return (
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Store Layout</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="text-center py-8">Loading store layout...</div>
// //         </CardContent>
// //       </Card>
// //     )
// //   }

// //   if (!storeLayout) {
// //     return (
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Store Layout</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="text-center py-8 text-gray-500">Store layout information is not available.</div>
// //         </CardContent>
// //       </Card>
// //     )
// //   }

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <CardTitle>Store Layout Management</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="md:col-span-2">
// //             <div className="border rounded-md p-4 bg-gray-50 h-[500px] relative">
// //               {/* Store layout visualization */}
// //               <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
// //                 {storeLayout.sections.map((section: any) => (
// //                   <div
// //                     key={section.id}
// //                     className={`border rounded-md flex items-center justify-center p-2 cursor-pointer transition-colors ${
// //                       selectedSection === section.id ? "bg-blue-100 border-blue-300" : "bg-white hover:bg-gray-100"
// //                     }`}
// //                     style={{
// //                       gridColumn: `span ${section.dimensions.width}`,
// //                       gridRow: `span ${section.dimensions.height}`,
// //                     }}
// //                     onClick={() => setSelectedSection(section.id)}
// //                   >
// //                     <div className="text-center">
// //                       <div className="font-medium">{section.name}</div>
// //                       <div className="text-xs text-gray-500">{section.type}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-base">Section Details</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 {selectedSection ? (
// //                   (() => {
// //                     const section = storeLayout.sections.find((s: any) => s.id === selectedSection)
// //                     return (
// //                       <div className="space-y-4">
// //                         <div>
// //                           <h3 className="font-medium">{section.name}</h3>
// //                           <p className="text-sm text-gray-500">{section.type}</p>
// //                         </div>

// //                         <div className="flex gap-2">
// //                           <Button variant="outline" size="sm" onClick={() => handleEditSection(section.id)}>
// //                             Edit Section
// //                           </Button>
// //                           <Button variant="outline" size="sm" onClick={() => handleAddProductToSection(section.id)}>
// //                             Add Product
// //                           </Button>
// //                         </div>

// //                         <div>
// //                           <h4 className="text-sm font-medium mb-1">Products in this section:</h4>
// //                           {section.products && section.products.length > 0 ? (
// //                             <ul className="space-y-1">
// //                               {section.products.map((product: any) => (
// //                                 <li key={product.id} className="text-sm">
// //                                   {product.name} - Aisle {product.aisle}
// //                                 </li>
// //                               ))}
// //                             </ul>
// //                           ) : (
// //                             <p className="text-sm text-gray-500">No products in this section.</p>
// //                           )}
// //                         </div>
// //                       </div>
// //                     )
// //                   })()
// //                 ) : (
// //                   <div className="text-center py-4 text-gray-500">Select a section to view details</div>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             <div className="mt-4">
// //               <Button variant="outline" className="w-full" onClick={fetchData}>
// //                 Refresh Layout
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //           <DialogContent className="sm:max-w-[425px]">
// //             <DialogHeader>
// //               <DialogTitle>{editMode === "section" ? "Edit Section" : "Add Product to Section"}</DialogTitle>
// //             </DialogHeader>
// //             <div className="grid gap-4 py-4">
// //               {editMode === "section" ? (
// //                 <>
// //                   <div className="grid grid-cols-4 items-center gap-4">
// //                     <Label htmlFor="sectionName" className="text-right">
// //                       Name
// //                     </Label>
// //                     <Input
// //                       id="sectionName"
// //                       name="sectionName"
// //                       value={formData.sectionName}
// //                       onChange={handleInputChange}
// //                       className="col-span-3"
// //                     />
// //                   </div>
// //                   <div className="grid grid-cols-4 items-center gap-4">
// //                     <Label htmlFor="sectionType" className="text-right">
// //                       Type
// //                     </Label>
// //                     <Select
// //                       value={formData.sectionType}
// //                       onValueChange={(value) => handleSelectChange("sectionType", value)}
// //                     >
// //                       <SelectTrigger id="sectionType" className="col-span-3">
// //                         <SelectValue placeholder="Select section type" />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         <SelectItem value="grocery">Grocery</SelectItem>
// //                         <SelectItem value="produce">Produce</SelectItem>
// //                         <SelectItem value="dairy">Dairy</SelectItem>
// //                         <SelectItem value="meat">Meat</SelectItem>
// //                         <SelectItem value="bakery">Bakery</SelectItem>
// //                         <SelectItem value="frozen">Frozen</SelectItem>
// //                         <SelectItem value="household">Household</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <>
// //                   <div className="grid grid-cols-4 items-center gap-4">
// //                     <Label htmlFor="productId" className="text-right">
// //                       Product
// //                     </Label>
// //                     <Select
// //                       value={formData.productId}
// //                       onValueChange={(value) => handleSelectChange("productId", value)}
// //                     >
// //                       <SelectTrigger id="productId" className="col-span-3">
// //                         <SelectValue placeholder="Select product" />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {products.map((product) => (
// //                           <SelectItem key={product.id} value={product.id}>
// //                             {product.name}
// //                           </SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                   <div className="grid grid-cols-4 items-center gap-4">
// //                     <Label htmlFor="aisle" className="text-right">
// //                       Aisle
// //                     </Label>
// //                     <Input
// //                       id="aisle"
// //                       name="aisle"
// //                       value={formData.aisle}
// //                       onChange={handleInputChange}
// //                       className="col-span-3"
// //                     />
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //             <DialogFooter>
// //               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button onClick={handleSubmit}>Save</Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </CardContent>
// //     </Card>
// //   )
// // }


// "use client"
// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import ManagerLayout from "@/components/layouts/manager-layout"

// const mockData = {
//   Dairy: ["Milk", "Cheese", "Yogurt"],
//   Meat: ["Chicken", "Beef", "Pork"],
//   Bakery: ["Bread", "Bagel", "Croissant"],
//   Produce: ["Apple", "Banana", "Carrot"]
// }

// export default function StoreLayout() {
//   const [search, setSearch] = useState("")

//   const getSearchMatches = () => {
//     const results: { product: string; category: string }[] = []
//     if (search.trim() === "") return results

//     for (const [category, items] of Object.entries(mockData)) {
//       items.forEach((item) => {
//         if (item.toLowerCase().includes(search.toLowerCase())) {
//           results.push({ product: item, category })
//         }
//       })
//     }
//     return results
//   }

//   const searchMatches = getSearchMatches()

//   const filterProducts = (category: string) =>
//     mockData[category].filter((item) =>
//       item.toLowerCase().includes(search.toLowerCase())
//     )

//   return (
//     <ManagerLayout>
//       <div className="container py-6">
//         <h1 className="text-2xl font-bold mb-4">Store Layout Map</h1>

//         <Input
//           type="text"
//           placeholder="Search for a product..."
//           className="mb-2"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {searchMatches.length > 0 && (
//           <div className="text-sm text-gray-700 mb-6">
//             {searchMatches.map((match, index) => (
//               <p key={index}>
//                 <strong>{match.product}</strong> is in <strong>{match.category}</strong>
//               </p>
//             ))}
//           </div>
//         )}

//         {/* 📍 Grid-style Store Layout */}
//         <div className="grid grid-cols-4 gap-4 h-[500px] text-sm font-medium text-center mb-10">
//           {/* Left Aisle */}
//           <div className="col-span-1 row-span-4 bg-gray-100 border flex items-center justify-center p-4">
//             <div>
//               <h2 className="mb-2">Dairy</h2>
//               <ul className="text-xs text-left">
//                 {filterProducts("Dairy").map((item, i) => (
//                   <li key={i}>• {item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Top Middle */}
//           <div className="col-span-2 bg-red-100 border flex items-center justify-center p-4">
//             <div>
//               <h2 className="mb-2">Bakery</h2>
//               <ul className="text-xs text-left">
//                 {filterProducts("Bakery").map((item, i) => (
//                   <li key={i}>• {item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Center block: Meat + Produce stacked */}
//           <div className="col-span-2 row-span-2 border border-dashed flex flex-col justify-evenly items-center bg-white">
//             <div>
//               <h2 className="text-blue-800">Meat</h2>
//               <ul className="text-xs text-left">
//                 {filterProducts("Meat").map((item, i) => (
//                   <li key={i}>• {item}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h2 className="text-green-800">Produce</h2>
//               <ul className="text-xs text-left">
//                 {filterProducts("Produce").map((item, i) => (
//                   <li key={i}>• {item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Checkout Area */}
//           <div className="col-span-2 bg-green-100 border flex items-center justify-center">
//             <h2 className="text-xl">Checkout</h2>
//           </div>

//           {/* Right Wall */}
//           <div className="col-span-1 row-span-4 bg-gray-100 border flex items-center justify-center">
//             <h2>Other Sections</h2>
//           </div>
//         </div>
//       </div>
//     </ManagerLayout>
//   )
// }

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import ManagerLayout from "@/components/layouts/manager-layout"

const storeSections = [
  { key: "A", name: "Dairy" },
  { key: "B", name: "Bakery" },
  { key: "C", name: "Produce" },
  { key: "D", name: "Meat" },
  { key: "E", name: "Checkout" },
]

const productsData: Record<string, { section: string; inStock: boolean }> = {
  Milk: { section: "A", inStock: true },
  Cheese: { section: "A", inStock: true },
  Yogurt: { section: "A", inStock: false },
  Bread: { section: "B", inStock: true },
  Bagel: { section: "B", inStock: false },
  Croissant: { section: "B", inStock: true },
  Apple: { section: "C", inStock: true },
  Banana: { section: "C", inStock: true },
  Carrot: { section: "C", inStock: true },
  Chicken: { section: "D", inStock: true },
  Beef: { section: "D", inStock: false },
  Pork: { section: "D", inStock: true },
}

const sectionColors: Record<string, string> = {
  A: "ring-4 ring-yellow-400 scale-105",
  B: "ring-4 ring-orange-400 scale-105",
  C: "ring-4 ring-green-400 scale-105",
  D: "ring-4 ring-red-400 scale-105",
}

export default function StoreLayout() {
  const [search, setSearch] = useState("")

  // Find product info by search
  const foundProduct = Object.entries(productsData).find(
    ([name]) => name.toLowerCase() === search.trim().toLowerCase()
  )

  // Find which section to highlight
  const highlightedSection =
    foundProduct && foundProduct[1].inStock ? foundProduct[1].section : null

  return (
    <ManagerLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Store Layout Map</h1>

        <Input
          type="text"
          placeholder="Search for a product..."
          className="mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Search result message */}
        {search.trim() && (
          <div className="mb-4 text-md font-semibold">
            {foundProduct ? (
              foundProduct[1].inStock ? (
                <span className="text-green-700">
                  {foundProduct[0]} is in {storeSections.find(s => s.key === foundProduct[1].section)?.name} ({foundProduct[1].section})
                </span>
              ) : (
                <span className="text-red-700">
                  {foundProduct[0]} is out of stock.
                </span>
              )
            ) : (
              <span className="text-gray-700">Product not found.</span>
            )}
          </div>
        )}

        {/* Store Layout Grid */}
        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-[500px] text-lg font-medium text-center mb-10">
          {/* Produce (C) - Top left, large */}
          <div
            className={`row-span-2 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "C" ? sectionColors["C"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Produce</div>
              <div className="text-sm text-gray-500">C</div>
            </div>
          </div>
          {/* Bakery (B) - Top right */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "B" ? sectionColors["B"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Bakery</div>
              <div className="text-sm text-gray-500">B</div>
            </div>
          </div>
          {/* Dairy (A) - Middle left */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "A" ? sectionColors["A"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Dairy</div>
              <div className="text-sm text-gray-500">A</div>
            </div>
          </div>
          {/* Meat (D) - Middle right */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "D" ? sectionColors["D"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Meat</div>
              <div className="text-sm text-gray-500">D</div>
            </div>
          </div>
          {/* Checkout (E) - Bottom right */}
          <div className="row-span-1 col-span-2 border flex items-center justify-center bg-green-100">
            <div>
              <div className="text-2xl font-bold">Checkout</div>
              <div className="text-sm text-gray-500">E</div>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
