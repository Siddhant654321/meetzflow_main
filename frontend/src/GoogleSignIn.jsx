import { useLayoutEffect, useState } from 'react';
import './styles/googleSignIn.css';
import GoogleButton from 'react-google-button'
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from './CustomHooks/useAxios';
import config from './config';

const GoogleSignIn = () => { 
    const location = useLocation();
    const navigate = useNavigate();
    const axios = useAxios();
    const [reauthentication, setReauthetication] = useState(false);
    useLayoutEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const isSuccess = queryParams.get("success")
        if(isSuccess === 'success'){
            localStorage.setItem('isGoogleConnected', true);
            navigate('/app')
        }
        const isGoogleConnected = async () => {
            try {
                const { data } = await axios.get('/api/user/is-google-auth', {withCredentials: true});
                if(data === 'Your Google Calendar Account is already connected'){
                    localStorage.setItem('isGoogleConnected', true);
                    navigate('/app')
                }
            } catch(error) {
                if(error.response.data === 'Your Google Calendar Account is not connected'){
                    localStorage.removeItem('isGoogleConnected')
                    setReauthetication(true)
                }
            }
        }
        isGoogleConnected()
    }, [])
    return (
        <div className='signInGoogleDiv'>
            <p className='signInGoogleText'>{reauthentication ? 'You need to re-connect your Google Calendar to keep using our functionalities' : `Sign into your Google Calendar to access Meetzflow's awesome features`}</p>
            <GoogleButton
                onClick={() => {window.open(`${config.backend_url}/auth/google`)}}
                style={{margin: 'auto'}}
            />
        </div>
    )
}

export default GoogleSignIn;