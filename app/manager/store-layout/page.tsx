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