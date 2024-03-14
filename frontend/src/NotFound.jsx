import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className='ve-background'>
            <h3>The page you are looking for does not exist!</h3>
            {!localStorage.getItem('loggedIn') ? 
            <button id="ve-btn" onClick={() => navigate('/')}>Go To Home</button> : 
            <button id="ve-btn" onClick={() => navigate('/app')}>Go To Dashboard</button>}
        </div>
    )
}
