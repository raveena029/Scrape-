// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { BarChart, LineChart, PieChart } from "lucide-react"
// import ManagerLayout from "@/components/layouts/manager-layout"
// import { toast } from "@/components/ui/use-toast"

// export default function ManagerDashboard() {
//   const [salesData, setSalesData] = useState({
//     today: 0,
//     week: 0,
//     month: 0,
//   })
//   const [inventoryAlerts, setInventoryAlerts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Fetch dashboard data
//     const fetchDashboardData = async () => {
//       try {
//         // In a real application, these would be API calls
//         // For demo purposes, we're using mock data

//         // Simulate API delay
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         setSalesData({
//           today: 2450.75,
//           week: 15780.25,
//           month: 68420.5,
//         })

//         setInventoryAlerts([
//           { id: "P001", name: "Milk", currentStock: 5, threshold: 10 },
//           { id: "P015", name: "Bread", currentStock: 3, threshold: 15 },
//           { id: "P042", name: "Eggs", currentStock: 2, threshold: 8 },
//         ])
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         toast({
//           title: "Failed to fetch dashboard data",
//           description: "There was an error loading the dashboard. Please try again later.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   return (
//     <ManagerLayout>
//       <div className="container mx-auto py-6">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
//               <BarChart className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">${isLoading ? "..." : salesData.today.toFixed(2)}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
//               <LineChart className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">${isLoading ? "..." : salesData.week.toFixed(2)}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
//               <PieChart className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">${isLoading ? "..." : salesData.month.toFixed(2)}</div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Inventory Alerts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <p>Loading inventory alerts...</p>
//               ) : inventoryAlerts.length > 0 ? (
//                 <div className="space-y-4">
//                   {inventoryAlerts.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md"
//                     >
//                       <div>
//                         <p className="font-medium">{item.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Current Stock: <span className="text-red-600 font-medium">{item.currentStock}</span> /
//                           Threshold: {item.threshold}
//                         </p>
//                       </div>
//                       <Button size="sm">Reorder</Button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p>No inventory alerts at this time.</p>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button className="w-full" onClick={() => (window.location.href = "/manager/reports")}>
//                   Generate Reports
//                 </Button>
//                 <Button className="w-full" onClick={() => (window.location.href = "/manager/inventory")}>
//                   Manage Inventory
//                 </Button>
//                 <Button className="w-full" onClick={() => (window.location.href = "/manager/products")}>
//                   Update Products
//                 </Button>
//                 <Button className="w-full" onClick={() => (window.location.href = "/manager/pricing")}>
//                   Adjust Pricing
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </ManagerLayout>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { getProducts, getInventory, getSales } from "@/lib/api"

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    recentSales: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch products
      const products = await getProducts()

      // Fetch inventory
      const inventory = await getInventory()

      // Count low stock items
      const lowStockItems = inventory.filter((item: any) => item.currentQuantity < item.minimumThreshold).length

      // Fetch recent sales
      const today = new Date()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(today.getDate() - 30)

      const sales = await getSales(thirtyDaysAgo.toISOString().split("T")[0], today.toISOString().split("T")[0])

      // Calculate total sales amount
      const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0)

      setDashboardData({
        totalProducts: products.length,
        lowStockItems,
        totalSales,
        recentSales: sales.slice(0, 5), // Get 5 most recent sales
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${dashboardData.totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.recentSales.length > 0 ? (
              <ul>
                {dashboardData.recentSales.map((sale: any, idx: number) => (
                  <li key={idx} className="mb-2">
                    <span className="font-medium">{sale.productName}</span> - {sale.quantity} units - ${sale.total.toFixed(2)} on {sale.saleDate}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No recent sales data available.</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <a href="/manager/inventory">Manage Inventory</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/manager/products">Update Products</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/manager/reports">Generate Reports</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/manager/promotions">Manage Promotions</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}