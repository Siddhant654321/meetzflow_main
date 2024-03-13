import Navbar from "./Navbar.jsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import ResetPassword from "./ResetPassword.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
  },
  {
    path: 'get-started',
    element: <Signup />
  },
  {
    path: 'login',
    element: <Signin />
  },
  {
    path: 'forgot-password',
    element: <ResetPassword />
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
