import Navbar from "./Navbar.jsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
