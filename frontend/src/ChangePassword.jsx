import { useState, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/loginAndSignup.css'
import InputFields from './Components/InputFields';
import axios from 'axios'
import dataStorage from './utilities/dataStorage'

const ChangePassword = () => {
    
    const {code, email} = useParams();
    const [inputState, setInputState] = useState(() => ({ password: '', confirmPassword: '' }));
    const [passwordType, setPasswordType] = useState(() => 'password');
    const [btn, setBtn] = useState(() => 'Set Password');
    const [errors, setErrors] = useState(() => ({ 'passwordError': '', 'confirmPasswordError': '', 'serverError': '' }))
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [isLoggedIn, setIsLoggedIn] = useState(() => false)
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(() => '')

    const handleClick = async (e) => {
        e.preventDefault()
        let inputErrors = {...errors, serverError: ''}
        if(inputState.password.length < 6){
            inputErrors = {...inputErrors, passwordError: 'Password should be at least 6 characters long'}
        } else {
            inputErrors = {...inputErrors, passwordError: ''}
        }
        if(inputState.confirmPassword !== inputState.password){
            inputErrors = {...inputErrors, confirmPasswordError: 'Confirm Password should be the same as password'}
        } else {
            inputErrors = {...inputErrors, confirmPasswordError: ''}
        } 
        setErrors(inputErrors)
        if(inputErrors.passwordError === '' && inputErrors.confirmPasswordError === '' && inputErrors.serverError === ''){
            try {
                setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span style={{marginLeft: '6px'}}>Loading...</span>
                </div>)
                setIsBtnDisabled(true)
                const response = await axios.patch(`https://meetzflow.com/endpoint/change-password/${code}/${email}`, { password: inputState.password}, {withCredentials: true})
                setSuccessMessage('Password has been changed successfully!')
                dataStorage({
                    loggedIn: true,
                    name: response.data.name,
                    email: response.data.email
                })
                navigate('/app')
                setBtn(<i className="bi bi-check-lg"></i>)
            } catch (error) {
                setErrors(prev => ({...prev, serverError: error.response.data.error}))
                setBtn('Set Password');
                setIsBtnDisabled(false);
            }
        }
    }

    const passwordVisibility = () => {
        setPasswordType(() => passwordType === 'password' ? 'text' : 'password')
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
                <InputFields key='password' inputState={inputState} name='password' errorState={errors} error='passwordError' password={true} type={passwordType} passwordVisibility={passwordVisibility} placeholder='New Password' margin='mb-3' setInputState={setInputState}/>
                <InputFields key='confirmPassword' inputState={inputState} name='confirmPassword' errorState={errors} error='confirmPasswordError' password={true} type={passwordType} passwordVisibility={passwordVisibility} placeholder='Confirm Password' setInputState={setInputState}/>
                <span className="error" style={{textAlign: 'center'}}>{errors.serverError}</span>
                <span className="success" style={{textAlign: 'center'}}>{successMessage}</span>
                <button type="submit" onClick={e => handleClick(e)} disabled={isBtnDisabled}>{btn}</button>
            </form>
        </div>
    )
}

export default ChangePassword;