import { useEffect } from 'react';
import './styles/verifyEmail.css';
import {useNavigate, useLocation} from 'react-router-dom'

const Error = () => {

    const navigate = useNavigate();
    const passedState = useLocation().state

    useEffect(() => {
        if(!passedState){
            navigate('/')
        }
    }, [])

    if(!passedState){
        return null
    }

    const {error} = passedState
    
    return (
        <div className='ve-background'>
            <h3>{error}</h3>
            {!localStorage.getItem('loggedIn') ? 
            <button id="ve-btn" onClick={() => navigate('/')}>Go To Home</button> : 
            <button id="ve-btn" onClick={() => navigate('/app')}>Go To Dashboard</button>}
        </div>
    )
};

export default Error;