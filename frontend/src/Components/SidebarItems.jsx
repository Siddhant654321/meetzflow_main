import { NavLink } from 'react-router-dom';

const SidebarItems = ({icon, name, path, logout, end}) => {
    return (
        <NavLink key={icon} to={path} end={end} className="nav_link" onClick={logout ? (e) => logout(e) : undefined}> <i className={`bi bi-${icon} nav_icon`}></i> <span className="nav_name">{name}</span> </NavLink> 
    )
}

export default SidebarItems