import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./components/RootLayout"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import SigninPage from "./pages/SigninPage"
import ProductDetails from "./pages/ProductDetails"
import Contact from "./pages/Contact"
import AdminPanel from "./pages/AdminPanelPage"


function App() {
 const router = createBrowserRouter([{path: "/", element: <RootLayout/>, children:[{index: true, element: <HomePage/>},
    {path: "/products", element: <ProductsPage/>}, 
    {path: "/signin", element: <SigninPage/>}, 
    {path: "/contact", element: <Contact/>}, 
    {path: "/adminPanel", element: <AdminPanel/>}, 
    {path: "/products/:productID", element: <ProductDetails/>}]}])

  return <RouterProvider router={router}/>
}

export default App
