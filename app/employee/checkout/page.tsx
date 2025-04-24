// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { toast } from "@/components/ui/use-toast"
// import { getProductById, createInvoice, getCustomerById } from "@/lib/api"
// import EmployeeLayout from "@/components/layouts/employee-layout"

// interface Product {
//   id: string
//   name: string
//   price: number
//   category: string
// }

// interface CartItem extends Product {
//   quantity: number
// }

// export default function Checkout() {
//   const [productId, setProductId] = useState("")
//   const [customerId, setCustomerId] = useState("")
//   const [customer, setCustomer] = useState<any>(null)
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isCheckingOut, setIsCheckingOut] = useState(false)
//   const router = useRouter()

//   // Check if user is logged in
//   useEffect(() => {
//     const user = localStorage.getItem("user")
//     if (!user) {
//       router.push("/")
//     } else {
//       const userData = JSON.parse(user)
//       if (userData.role !== "employee") {
//         router.push("/")
//       }
//     }
//   }, [router])

//   const handleAddProduct = async () => {
//     if (!productId.trim()) return

//     setIsLoading(true)
//     try {
//       const product = await getProductById(productId)

//       if (!product) {
//         toast({
//           title: "Product Not Found",
//           description: "Please check the product ID and try again",
//           variant: "destructive",
//         })
//         return
//       }

//       // Check if product is already in cart
//       const existingItemIndex = cart.findIndex((item) => item.id === product.id)

//       if (existingItemIndex >= 0) {
//         // Update quantity if product already in cart
//         const updatedCart = [...cart]
//         updatedCart[existingItemIndex].quantity += 1
//         setCart(updatedCart)
//       } else {
//         // Add new product to cart
//         setCart([...cart, { ...product, quantity: 1 }])
//       }

//       setProductId("")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add product to cart",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRemoveItem = (index: number) => {
//     const updatedCart = [...cart]
//     updatedCart.splice(index, 1)
//     setCart(updatedCart)
//   }

//   const handleUpdateQuantity = (index: number, newQuantity: number) => {
//     if (newQuantity < 1) return

//     const updatedCart = [...cart]
//     updatedCart[index].quantity = newQuantity
//     setCart(updatedCart)
//   }

//   const handleLookupCustomer = async () => {
//     if (!customerId.trim()) return

//     setIsLoading(true)
//     try {
//       const customerData = await getCustomerById(customerId)

//       if (!customerData) {
//         toast({
//           title: "Customer Not Found",
//           description: "Please check the customer ID and try again",
//           variant: "destructive",
//         })
//         setCustomer(null)
//         return
//       }

//       setCustomer(customerData)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to lookup customer",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const calculateSubtotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
//   }

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.08 // Assuming 8% tax rate
//   }

//   const calculateDiscount = () => {
//     // Apply discount if customer has loyalty points
//     if (customer && customer.loyaltyPoints >= 100) {
//       return calculateSubtotal() * 0.05 // 5% discount
//     }
//     return 0
//   }

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax() - calculateDiscount()
//   }

//   const handleCheckout = async () => {
//     if (cart.length === 0) {
//       toast({
//         title: "Empty Cart",
//         description: "Please add products to the cart before checkout",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsCheckingOut(true)
//     try {
//       const invoice = {
//         customerId: customer?.id || "guest",
//         items: cart.map((item) => ({
//           productId: item.id,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//         subtotal: calculateSubtotal(),
//         tax: calculateTax(),
//         discount: calculateDiscount(),
//         total: calculateTotal(),
//         paymentMethod: "cash", // Default payment method
//       }

//       const response = await createInvoice(invoice)

//       if (response.success) {
//         toast({
//           title: "Checkout Successful",
//           description: `Invoice #${response.invoiceId} created successfully`,
//         })

//         // Clear cart and customer after successful checkout
//         setCart([])
//         setCustomer(null)
//         setCustomerId("")
//       } else {
//         toast({
//           title: "Checkout Failed",
//           description: "Failed to create invoice",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred during checkout",
//         variant: "destructive",
//       })
//     } finally {
//       setIsCheckingOut(false)
//     }
//   }

//   return (
//     <EmployeeLayout>
//       <div className="container mx-auto py-6">
//         <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Shopping Cart</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center space-x-2 mb-4">
//                   <Input
//                     placeholder="Enter Product ID"
//                     value={productId}
//                     onChange={(e) => setProductId(e.target.value)}
//                     className="flex-1"
//                   />
//                   <Button onClick={handleAddProduct} disabled={isLoading}>
//                     Add
//                   </Button>
//                 </div>

//                 {cart.length > 0 ? (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Product</TableHead>
//                         <TableHead>Price</TableHead>
//                         <TableHead>Quantity</TableHead>
//                         <TableHead>Total</TableHead>
//                         <TableHead></TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {cart.map((item, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{item.name}</TableCell>
//                           <TableCell>${item.price.toFixed(2)}</TableCell>
//                           <TableCell>
//                             <div className="flex items-center space-x-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
//                               >
//                                 -
//                               </Button>
//                               <span>{item.quantity}</span>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
//                               >
//                                 +
//                               </Button>
//                             </div>
//                           </TableCell>
//                           <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
//                           <TableCell>
//                             <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
//                               Remove
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 ) : (
//                   <div className="text-center py-4">
//                     <p className="text-muted-foreground">No items in cart</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           <div>
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle>Customer</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center space-x-2 mb-4">
//                   <Input
//                     placeholder="Enter Customer ID"
//                     value={customerId}
//                     onChange={(e) => setCustomerId(e.target.value)}
//                     className="flex-1"
//                   />
//                   <Button onClick={handleLookupCustomer} disabled={isLoading}>
//                     Lookup
//                   </Button>
//                 </div>

//                 {customer ? (
//                   <div className="space-y-2">
//                     <p>
//                       <strong>Name:</strong> {customer.name}
//                     </p>
//                     <p>
//                       <strong>Loyalty Points:</strong> {customer.loyaltyPoints}
//                     </p>
//                     <p>
//                       <strong>Credit Balance:</strong> ${customer.creditBalance.toFixed(2)}
//                     </p>
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground">No customer selected</p>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal:</span>
//                     <span>${calculateSubtotal().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tax (8%):</span>
//                     <span>${calculateTax().toFixed(2)}</span>
//                   </div>
//                   {calculateDiscount() > 0 && (
//                     <div className="flex justify-between">
//                       <span>Discount:</span>
//                       <span>-${calculateDiscount().toFixed(2)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between font-bold pt-2 border-t">
//                     <span>Total:</span>
//                     <span>${calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <Button className="w-full mt-4" onClick={handleCheckout} disabled={isCheckingOut || cart.length === 0}>
//                   {isCheckingOut ? "Processing..." : "Complete Checkout"}
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </EmployeeLayout>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  getProductById, getCustomerById, updateCustomerCredits, createSale, getPromotions,
} from "@/lib/api"

export default function EmployeeCheckout() {
  const [productId, setProductId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [customer, setCustomer] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [appliedPromotions, setAppliedPromotions] = useState<any[]>([])
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [useCredits, setUseCredits] = useState(false)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const promotions = await getPromotions()
        setAvailablePromotions(promotions)
      } catch (error) {
        console.error("Error fetching promotions:", error)
      }
    }

    fetchPromotions()
  }, [])

  useEffect(() => {
    calculateTotals()
  }, [cartItems, appliedPromotions, useCredits, customer])

  const handleAddProduct = async () => {
    if (!productId.trim()) return

    try {
      const product = await getProductById(productId)
      const existingIndex = cartItems.findIndex((item) => item.id === product.id)

      if (existingIndex >= 0) {
        const updated = [...cartItems]
        updated[existingIndex].quantity += 1
        setCartItems(updated)
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }])
      }

      const promos = checkPromotions(product)

      if (promos.length > 0) {
        toast({
          title: "Promotion Found",
          description: promos.map((p) => p.name).join(", "),
        })
      }

      setProductId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please check the product ID.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...cartItems]
    newItems.splice(index, 1)
    setCartItems(newItems)
    recalculatePromotions(newItems)
  }

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty < 1) return
    const updated = [...cartItems]
    updated[index].quantity = newQty
    setCartItems(updated)
    recalculatePromotions(updated)
  }

  const handleLookupCustomer = async () => {
    if (!customerId.trim()) return

    try {
      const customerData = await getCustomerById(customerId)
      setCustomer(customerData)
      toast({
        title: "Customer Found",
        description: `${customerData.name} has ${customerData.loyaltyPoints} points and $${customerData.creditBalance.toFixed(2)} credits.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Customer not found. Please check the ID.",
        variant: "destructive",
      })
    }
  }

  const checkPromotions = (product: any) => {
    const promos = availablePromotions.filter(
      (promo) => promo.productId === product.id || promo.category === product.category || promo.applicableToAll,
    )

    const newPromos = promos.filter((p) => !appliedPromotions.some((a) => a.id === p.id))
    if (newPromos.length > 0) {
      setAppliedPromotions([...appliedPromotions, ...newPromos])
    }

    return newPromos
  }

  const recalculatePromotions = (items: any[]) => {
    const updated = appliedPromotions.filter((promo) => {
      if (promo.applicableToAll) return true
      return items.some((item) => promo.productId === item.id || promo.category === item.category)
    })
    setAppliedPromotions(updated)
  }

  const calculateTotals = () => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(sub)

    let disc = 0
    appliedPromotions.forEach((promo) => {
      if (promo.discountType === "percentage") {
        disc += sub * (promo.discountValue / 100)
      } else if (promo.discountType === "fixed") {
        disc += promo.discountValue
      }
    })

    if (useCredits && customer && customer.creditBalance > 0) {
      const creditUsed = Math.min(customer.creditBalance, sub - disc)
      disc += creditUsed
    }

    setDiscount(disc)
    const taxAmount = (sub - disc) * 0.08
    setTax(taxAmount)
    setTotal(sub - disc + taxAmount)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const sale = {
        customerId: customer?.id || null,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        tax,
        discount,
        total,
        appliedPromotions: appliedPromotions.map((p) => p.id),
        creditsUsed: useCredits && customer ? Math.min(customer.creditBalance, discount) : 0,
      }

      const result = await createSale(sale)

      if (customer) {
        const earned = Math.floor(total / 10)
        const remaining = useCredits
          ? Math.max(0, customer.creditBalance - Math.min(customer.creditBalance, discount))
          : customer.creditBalance

        await updateCustomerCredits(customer.id, remaining + earned)
      }

      toast({
        title: "Checkout Complete",
        description: `Sale #${result.id} processed successfully.`,
      })
      // Build invoice content
      const invoiceContent = `
      Sale ID: ${result.id}
      Customer: ${customer ? customer.name : "Guest"}
      Date: ${new Date().toLocaleString()}

      Items:
      ${cartItems.map((item) => `- ${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`).join("\n")}

      Subtotal: $${subtotal.toFixed(2)}
      Discount: -$${discount.toFixed(2)}
      Tax: $${tax.toFixed(2)}
      Total: $${total.toFixed(2)}
      `

      // Create blob and download link
      const blob = new Blob([invoiceContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${result.id}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setCartItems([])
      setCustomer(null)
      setCustomerId("")
      setAppliedPromotions([])
      setUseCredits(false)
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to process checkout.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cart Panel */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Enter product ID to add items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
            />
            <Button onClick={handleAddProduct}>Add</Button>
          </div>

          {cartItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</Button>
                        <span>{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</Button>
                      </div>
                    </TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>×</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted mt-6">No items in cart</p>
          )}
        </CardContent>
      </Card>

      {/* Customer & Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer */}
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <div className="flex gap-2">
              <Input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Optional"
              />
              <Button variant="outline" onClick={handleLookupCustomer}>Lookup</Button>
            </div>
            {customer && (
              <div className="text-sm bg-gray-50 p-3 rounded">
                <p><b>{customer.name}</b></p>
                <p>Loyalty Points: {customer.loyaltyPoints}</p>
                <p>Credit Balance: ${customer.creditBalance.toFixed(2)}</p>
                {customer.creditBalance > 0 && (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="checkbox"
                      id="useCredits"
                      checked={useCredits}
                      onChange={(e) => setUseCredits(e.target.checked)}
                    />
                    <Label htmlFor="useCredits">Use credits</Label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Promotions */}
          {appliedPromotions.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Applied Promotions</h3>
              <ul className="space-y-1 text-sm">
                {appliedPromotions.map((promo, index) => (
                  <li key={index} className="flex justify-between text-green-700">
                    <span>
                      {promo.name} - {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : `$${promo.discountValue}`} off
                    </span>
                    <Button variant="outline" size="sm" onClick={() => {
                      const newPromos = [...appliedPromotions]
                      newPromos.splice(index, 1)
                      setAppliedPromotions(newPromos)
                    }}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1 border-t pt-4">
            <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Tax (8%):</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>Total:</span><span>${total.toFixed(2)}</span></div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut || cartItems.length === 0}>
            {isCheckingOut ? "Processing..." : "Complete Checkout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
