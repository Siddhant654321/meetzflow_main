import { Outlet } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav>Navbar</nav>
      <Outlet />
    </div>
  );
};
export default Navbar;
