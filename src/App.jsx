"use client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./components/RootLayout"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import SigninPage from "./pages/SigninPage"
import ProductDetails from "./pages/ProductDetails"
import Contact from "./pages/Contact"
import AdminPanel from "./pages/AdminPanelPage"
import UserCTX from "./context/UserContext"
import { useCallback, useEffect, useState } from "react"
import { API_BASE_URL } from "./api"
import ManageMenu from "./pages/ManageMenu"
import AdminReservationsPage from "./pages/AdminReservationsPage"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import ReservationsPage from "./pages/ReservationsPage"
import ManageUsersPage from "./pages/ManageUsersPage"
import ManageWorkersPage from "./pages/ManageWorkersPage"
import ContactMessages from "./pages/ContactMessages"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/signin", element: <SigninPage /> },
      { path: "/contact", element: <Contact /> },
      { path: "/adminPanel", element: <AdminPanel /> },
      { path: "/manage-menu", element: <ManageMenu /> },
      { path: "/products/:productID", element: <ProductDetails /> },
      { path: "/reservations", element: <ReservationsPage /> },
      { path: "/admin/reservations", element: <AdminReservationsPage /> },
      { path: "/profile", element: <Profile /> },
      { path: "/messages", element: <Messages /> },
      { path: "/admin/manage-users", element: <ManageUsersPage /> },
      {path: "/admin/manage-workers", element: <ManageWorkersPage/>},
      { path: "/admin/contact-messages", element: <ContactMessages /> }
    ],
  },
])

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const refreshUserData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to load current user")
      const currentUser = await response.json()
      setUser(currentUser)
      return currentUser
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshUserData().finally(() => setAuthLoading(false))
  }, [refreshUserData])

  return (
    <UserCTX.Provider value={{ user, setUser, refreshUserData }}>
      {authLoading ? <div className="app-loading"><p className="loader" role="status">Зареждане…</p></div> : <RouterProvider router={router} />}
    </UserCTX.Provider>
  )
}
export default App

