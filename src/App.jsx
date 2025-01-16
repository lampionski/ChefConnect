import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout, {loader as rootLoader} from "./components/RootLayout"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import SigninPage from "./pages/SigninPage"
import ProductDetails from "./pages/ProductDetails"
import Contact from "./pages/Contact"
import AdminPanel from "./pages/AdminPanelPage"
import UserCTX from "./context/UserContext"
import { useContext, useState } from "react"


function App() {

  const [user, setUser] = useState({})

 const router = createBrowserRouter([{path: "/", element: <RootLayout/>, loader: rootLoader, children:[{index: true, element: <HomePage/>},
    {path: "/products", element: <ProductsPage/>}, 
    {path: "/signin", element: <SigninPage/>}, 
    {path: "/contact", element: <Contact/>}, 
    {path: "/adminPanel", element: <AdminPanel/>}, 
    {path: "/products/:productID", element: <ProductDetails/>}]}])

  return <UserCTX.Provider value={{user,setUser}}><RouterProvider router={router}/></UserCTX.Provider>
}

export default App
