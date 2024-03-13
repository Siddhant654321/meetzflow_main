import {useState, useLayoutEffect} from "react";
import validator from 'email-validator';
import axios from 'axios';
import dataStorage from './utilities/dataStorage';
import { useNavigate, Link } from "react-router-dom";
import InputFields from "./Components/InputFields.jsx";
import { useLocation } from 'react-router-dom';

const Signin = () => {

    const [passwordType, setPasswordType] = useState(() => 'password');
    const [inputState, setInputState] = useState(() => ({ email: '', password: '' }))
    const [errors, setErrors] = useState(() => ({'emailError': '', 'passwordError': '', serverError: ''}))
    const [btn, setBtn] = useState(() => 'Log In Your Account')
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [isLoggedIn, setIsLoggedIn] = useState(() => false)
    const navigate = useNavigate();
    const location = useLocation();
    const { emailVerify } = location.state || '';

    useLayoutEffect(() => {
        if(localStorage.getItem('loggedIn')){
            navigate('/app')
            setIsLoggedIn(true)
        }
    }, [])

    if(isLoggedIn === true){
        return null
    }

    const handleClick = async (e) => {
        e.preventDefault();
        let inputErrors = {...errors, serverError: ''}
        if(!validator.validate(inputState.email)){
            inputErrors = {...inputErrors, emailError: 'Email is invalid'}
        } else {
            inputErrors = {...inputErrors, emailError: ''}
        }
        if(inputState.password.length < 6){
            inputErrors = {...inputErrors, passwordError: 'Password should be at least 6 characters long'}
        } else {
            inputErrors = {...inputErrors, passwordError: ''}
        }
        if(localStorage.getItem('loggedIn')){
            inputErrors = {...inputErrors, serverError: 'You are already logged in one account'}
        }
        setErrors(inputErrors)
        if(inputErrors.emailError === '' && inputErrors.passwordError === '' && inputErrors.serverError === ''){
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{marginLeft: '6px'}}>Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            try{
                const response = await axios.post('https://meetzflow.com/account/endpoint/login', inputState, {withCredentials: true})
                dataStorage({
                    loggedIn: true,
                    name: response.data.name,
                    email: response.data.email,
                    isGoogleConnected: response.data.isGoogleConnected
                })
                setBtn(<i className="bi bi-check-lg"></i>)
                navigate('/app')
            } catch (error) {
                if(error.response.data.error === "Either email or password is wrong"){
                    setErrors(() => ({...inputErrors, serverError: "Either email or password is wrong"}))
                } else if (error.response.data.hasOwnProperty('emailError')) {
                    setErrors(() => ({...inputErrors, serverError: error.response.data.emailError}))  
                } else {
                    setErrors(() => ({...inputErrors, serverError: 'Unable to log in to the account due to some server error'}))
                }
                setBtn('Log In Your Account')
                setIsBtnDisabled(false)
            }
        }
    }

    const passwordVisibility = () => {
        setPasswordType(() => passwordType === 'password' ? 'text' : 'password')
    }

    return (
        <div className='background'>
            <form id="join" novalidate>
                <h2><b>Log into MeetzFlow</b></h2>
                <InputFields key='email' inputState={inputState} name='email' errorState={errors} error='emailError' type='email' margin='mb-3' placeholder='Email' setInputState={setInputState}/>
                <InputFields key='password' inputState={inputState} name='password' errorState={errors} error='passwordError' password={true} type={passwordType} passwordVisibility={passwordVisibility} placeholder='Password' setInputState={setInputState}/>
                <span className="error" style={{textAlign: 'center'}}>{errors.serverError}</span>
                <span className="success" style={{textAlign: 'center'}}>{emailVerify}</span>
                <Link to='/forgot-password' state={{ email: inputState.email }} className="forgot-password" style={{textAlign: 'right'}}><strong>Forgot Password</strong></Link>
                <button type="submit" onClick={e => handleClick(e)} disabled={isBtnDisabled}>{btn}</button>
                <p className="mb-0 mt-2 text-center">New to MeetzFlow? <Link to='/get-started' className="purple-text" style={{textDecoration: 'none'}}>Create Account</Link></p>
            </form>
        </div>
    )
}

export default Signin