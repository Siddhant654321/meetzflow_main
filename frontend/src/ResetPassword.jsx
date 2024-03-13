import { useState, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/loginAndSignup.css'
import InputFields from './Components/InputFields';
import validator from 'email-validator';

import axios from 'axios'

const ResetPassword = () => {
    
    const location = useLocation();
    const { email } = location.state || '';
    const [inputState, setInputState] = useState(() => ({ email }));
    const [btn, setBtn] = useState(() => 'Forgot Password');
    const [errors, setErrors] = useState(() => ({ 'emailError': '' }))
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [isLoggedIn, setIsLoggedIn] = useState(() => false)
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(() => '')

    const handleClick = async (e) => {
        e.preventDefault()
        if(!validator.validate(inputState.email)){
            setErrors({ emailError: 'Email is invalid' })
        } else {
            setErrors({ emailError: '' })
            try {
                setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span style={{marginLeft: '6px'}}>Loading...</span>
                </div>)
                setIsBtnDisabled(true)
                const response = await axios.post('https://meetzflow.com/endpoint/account/forgot-password', { email: inputState.email })
                setSuccessMessage('Password Reset link is sent to your email!')
                setBtn(<i className="bi bi-check-lg"></i>)
            } catch (error) {
                setErrors(prev => ({...prev, emailError: error.response.data.error}))
                setBtn('Forgot Password')
                setIsBtnDisabled(false)
            }
        }
    }

    useLayoutEffect(() => {
        if(localStorage.getItem('loggedIn')){
            navigate('/app')
            setIsLoggedIn(true)
        }
    }, [])

    if(isLoggedIn){
        return null;
    }

    return (
        <div className='background'>
            <form id="join" novalidate>
                <h2><b>Change Password</b></h2>
                <InputFields key='email' inputState={inputState} name='email' errorState={errors} error='emailError' type='email' margin='mb-3' placeholder='Registered Email' setInputState={setInputState}/>
                <span className="success" style={{textAlign: 'center'}}>{successMessage}</span>
                <button style={{marginTop: '0px'}} type="submit" onClick={e => handleClick(e)} disabled={isBtnDisabled}>{btn}</button>
            </form>
        </div>
    )
}

export default ResetPassword;