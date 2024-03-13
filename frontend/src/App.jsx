import Navbar from "./Navbar.jsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Signup.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
  },
  {
    path: 'get-started',
    element: <Signup />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
