"use client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout, { loader as rootLoader } from "./components/RootLayout"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import SigninPage from "./pages/SigninPage"
import ProductDetails from "./pages/ProductDetails"
import Contact from "./pages/Contact"
import AdminPanel from "./pages/AdminPanelPage"
import UserCTX from "./context/UserContext"
import { useState } from "react"
import ManageMenu from "./pages/ManageMenu"
import AdminReservationsPage from "./pages/AdminReservationsPage"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import ReservationsPage from "./pages/ReservationsPage"
import ManageUsersPage from "./pages/ManageUsersPage"
import ManageWorkersPage from "./pages/ManageWorkersPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: rootLoader,
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
      {path: "/admin/manage-workers", element: <ManageWorkersPage/>}
    ],
  },
])

function App() {
  const [user, setUser] = useState(null)
  //manage user authentication status and details
  return (
    <UserCTX.Provider value={{ user, setUser }}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>}/>
    </UserCTX.Provider>
  )
}
export default App

