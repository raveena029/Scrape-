// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { logoutUser } from "@/lib/api"

// export default function ManagerLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (!storedUser) {
//       router.push("/")
//       return
//     }

//     const parsedUser = JSON.parse(storedUser)
//     if (parsedUser.role !== "manager") {
//       router.push("/")
//       return
//     }

//     setUser(parsedUser)
//   }, [router])

//   const handleLogout = () => {
//     logoutUser()
//     router.push("/")
//   }

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">SNU-Mart</h2>
//           <p className="text-sm text-gray-500">Manager Dashboard</p>
//         </div>
//         <nav className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/manager")}>
//                 Dashboard
//               </Button>
//             </li>
//             <li>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => router.push("/manager/inventory")}
//               >
//                 Inventory
//               </Button>
//             </li>
//             <li>
//               <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/manager/products")}>
//                 Products
//               </Button>
//             </li>
//             <li>
//               <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/manager/reports")}>
//                 Reports
//               </Button>
//             </li>
//             <li>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => router.push("/manager/store-layout")}
//               >
//                 Store Layout
//               </Button>
//             </li>
//             <li>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => router.push("/manager/promotions")}
//               >
//                 Promotions
//               </Button>
//             </li>
//             <li className="pt-4 border-t mt-4">
//               <Button variant="outline" className="w-full" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <header className="bg-white shadow-sm p-4 flex justify-between items-center">
//           <h1 className="text-xl font-semibold">Manager Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-500">Welcome, {user.username}</span>
//           </div>
//         </header>
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/api"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ManagerProducts from "./products/page"
import ManagerInventory from "./inventory/page"
import ManagerCustomers from "../employee/customers/page"
import ManagerStoreLayout from "./store-layout/page"
import ManagerReports from "./reports/page"
import ManagerDashboard from "./page"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState("dashboard")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "manager") {
      router.push("/")
      return
    }
    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">SNU-Mart</h2>
          <p className="text-sm text-gray-500">Manager Dashboard</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Button variant={tab === "dashboard" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("dashboard")}>
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant={tab === "inventory" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("inventory")}>
                Inventory
              </Button>
            </li>
            <li>
              <Button variant={tab === "products" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("products")}>
                Products
              </Button>
            </li>
            <li>
              <Button variant={tab === "customers" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("customers")}>
                Customers
              </Button>
            </li>
            <li>
              <Button variant={tab === "store-layout" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("store-layout")}>
                Store Layout
              </Button>
            </li>
            <li>
              <Button variant={tab === "reports" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setTab("reports")}>
                Reports
              </Button>
            </li>
            <li className="pt-4 border-t mt-4">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Manager Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user.username}</span>
          </div>
        </header>
<<<<<<< HEAD
        <main className="p-6">
=======
        {/* <main className="p-6">
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
          <Tabs value={tab} onValueChange={setTab}>
            <TabsContent value="dashboard">
              <ManagerDashboard />
            </TabsContent>
            <TabsContent value="products">
              <ManagerProducts />
            </TabsContent>
            <TabsContent value="inventory">
              <ManagerInventory />
            </TabsContent>
            <TabsContent value="customers">
              <ManagerCustomers />
            </TabsContent>
            <TabsContent value="store-layout">
              <ManagerStoreLayout />
            </TabsContent>
            <TabsContent value="reports">
              <ManagerReports />
            </TabsContent>
          </Tabs>
<<<<<<< HEAD
        </main>
=======
        </main> */}
>>>>>>> 2b06a6e27269c71c63208dd4f48f72b82e9391b2
      </div>
    </div>
  )
}