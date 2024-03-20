import {useLayoutEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './styles/verifyEmail.css';
import MySpinner from './Components/MySpinner.jsx';
import axios from 'axios';
import config from './config.js';

const VerifyEmail = () => {
    const {code, email} = useParams();
    const [error, setError] = useState(() => '')
    const [isFetchingData, setIsFetchingData] = useState(() => true)
    const [btn, setBtn] = useState(() => 'Send Activation Link')
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [requestSent, setRequestSent] = useState(() => false)
    const navigate = useNavigate();
    const [isBtnHidden, setIsBtnHidden] = useState(() => true)

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                setRequestSent(true)
                const {data} = await axios.get(`${config.backend_url}/endpoint/verifyEmail/${code}/${email}`);
                if(data.hasOwnProperty('expired')){
                    setIsFetchingData(false)
                    setError(<h3>The link has expired. Click the button below to send a new link to the registered email</h3>)
                    setIsBtnHidden(false)    
                } else {
                    if(localStorage.getItem('loggedIn')){
                        navigate('/app')
                    } else {
                        navigate('/login',  { state: { emailVerify: 'Your email has been successfully verified' } })
                    }
                }
            } catch (error) {
                if(error.response.data.hasOwnProperty('error')){
                    setIsFetchingData(false)
                    setError(<h3>{error.response.data.error}</h3>)
                    setIsBtnHidden(true)
                } else {
                    setIsBtnHidden(true)
                    setError(<h3>Your Email couldn't be verified</h3>)
                }
            }
        }
        if(!requestSent){
            fetchData();
        }
    }, [])

    const handleClick = async () => {
        try {
            setIsBtnDisabled(true)
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{marginLeft: '6px'}}>Loading...</span>
            </div>)
            const response = await axios.post(`${config.backend_url}/endpoint/account/newVerificationCode`, { email})    
            setBtn('Sent')
        } catch (error) {
            if(error.response.data.hasOwnProperty('error')){
                setIsFetchingData(false)
                setError(<h3>{error.response.data.error}</h3>)
                setIsBtnHidden(true)
            } else {
                setError(<h3>Your Email couldn't be verified</h3>)
                setIsBtnHidden(true)
            }
            setIsBtnDisabled(false)
            setBtn('Send Activation Link')
        }
    }

    if(isFetchingData){
        return (
            <MySpinner className='full-width' />
        )
    }

    return (
        <div className='ve-background'>
            {error}
            <button disabled={isBtnDisabled} hidden={isBtnHidden} id="ve-btn" type="submit" onClick={handleClick}>{btn}</button>

        </div>
    );
}

export default VerifyEmail