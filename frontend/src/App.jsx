import Navbar from "./Navbar.jsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

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
