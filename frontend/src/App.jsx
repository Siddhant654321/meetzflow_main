import Navbar from "./Navbar.jsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import ResetPassword from "./ResetPassword.jsx";
import ChangePassword from "./ChangePassword.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import Contact from "./Contact.jsx";
import NotFound from "./NotFound.jsx";
import Homepage from "./Homepage.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import TermsAndConditions from './TermsAndConditions.jsx';
import Error from "./Error.jsx";
import Sidebar from "./Sidebar.jsx";
import GoogleSignIn from "./GoogleSignIn.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <Homepage />
      },  
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditions />
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
      {
        path: 'change-password/:code/:email',
        element: <ChangePassword />
      },
      {
        path: 'verify/:code/:email',
        element: <VerifyEmail />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: '*',
        element: <NotFound />
      },
      {
        path: 'error',
        element: <Error />
      }
    ]
  },
  {
    path: 'app',
    element: <Sidebar />,
    children:[
      {
        path: 'setup',
        element: <GoogleSignIn />
      },
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
