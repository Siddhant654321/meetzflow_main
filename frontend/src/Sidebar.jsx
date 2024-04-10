import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './styles/sidebar.css'
import SidebarItems from './Components/SidebarItems';
import useAxios from './CustomHooks/useAxios';
import {configureStore} from '@reduxjs/toolkit';
import teamReducer from './reducers/teamReducer';
import { Provider } from 'react-redux';
import meetzflow_logo from './assets/meetzflow_logo.svg'

const Sidebar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const axios = useAxios();
    const location = useLocation();


    const store = configureStore({
        reducer: {
            teamData: teamReducer
        }
    })


    const toggleShow = async () => {
        setShow(!show);
    };

    useEffect(() => {
        if (localStorage.getItem('loggedIn')) {
            setIsAuthenticated(true);
            if(!localStorage.getItem('isGoogleConnected') && location.pathname !== '/app/setup/' && location.pathname !== '/app/setup/?success=success') {
                navigate('/app/setup/')
            }
        } else {
            navigate('/get-started');
        }
    }, [])

    if (isAuthenticated === null) return null;

    if(location.pathname === '/app/setup/') return <Outlet />;

    if(!localStorage.getItem('isGoogleConnected') && location.pathname !== '/app/setup/'){
        return null
    }

    const logout = async (event) => {
        event.preventDefault();
        await axios.get('/account/endpoint/logout', {withCredentials: true})
        localStorage.clear();
        navigate('/')
    }


    return (
        <div className="app-container">
            <div className={`${show ? 'body-pd' : ''}`} id='body-pd'>
                <div className={`l-navbar ${show ? 'show-sidebar' : ''}`} id="nav-bar">
                    <nav className={"nav"}>
                        <div> 
                            <Link to="/app" className="nav_logo"> <img src={meetzflow_logo} height={30} width={30} /> <span className="nav_logo-name">MeetzFlow</span> </Link>
                            <div className="nav_list"> 
                                <SidebarItems name='Dashboard' end={true} icon='window' path='/app'/> 
                                <SidebarItems name='Notifications' icon='bell-fill' path='/app/notifications'/> 
                                <SidebarItems name='Meetings' icon='camera-video-fill' path='/app/meetings'/> 
                                <SidebarItems name='Teams' icon='people-fill' path='/app/teams'/> 
                                <SidebarItems name='Profile' icon='person-circle' path='/app/profile'/> 
                                <div className='nav_link collapse-div' onClick={toggleShow} style={{boxSizing: 'content-box'}}><button className={`toggle-btn rounded-circle`} id="toggle-btn"><i className={`bi bi-${show ? 'chevron-left' : 'chevron-right'} nav_icon`}></i> </button><span className="nav_name collapse-txt">Collapse</span></div>
                            </div>
                        </div> 
                        <SidebarItems name='Log Out' icon='box-arrow-left' path={'/'} logout={logout} />
                    </nav>
                </div>
            </div>
            <div>
                <div className={`${show ? 'overlay-page' : ''} darken`}></div>
                <Provider store={store}>
                    <Outlet />
                </Provider>
            </div>
        </div>
    )
}

export default Sidebar