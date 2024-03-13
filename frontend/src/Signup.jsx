import {useEffect, useState} from "react";
import './styles/loginAndSignup.css'
import validator from 'email-validator';
import axios from 'axios';
import dataStorage from './utilities/dataStorage';
import InputFields from "./Components/InputFields.jsx";
import {Link, useNavigate} from 'react-router-dom'

const Signup = () => {

    const [passwordType, setPasswordType] = useState(() => 'password');
    const [inputState, setInputState] = useState(() => ({ name: '', email: '', password: '' }))
    const [errors, setErrors] = useState(() => ({'nameError': '', 'emailError': '', 'passwordError': '', 'serverError': ''}))
    const [btn, setBtn] = useState(() => 'Create Account')
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => false)
    const [successMessage, setSuccessMessage] = useState(() => '');
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('loggedIn')){
            setIsLoggedIn(true)
            navigate('/app')
        }
    }, [])

    if(isLoggedIn === true){
        return null
    }

    const handleClick = async (e) => {
        e.preventDefault();
        let inputErrors = {...errors, serverError: ''}
        if(inputState.name.length <= 2){
            inputErrors = {...inputErrors, nameError: 'Name should be at least 3 characters long'}
        } else {
            inputErrors = {...inputErrors, nameError: ''}
        }
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
        setErrors(inputErrors)
        if(inputErrors.nameError === '' && inputErrors.emailError === '' && inputErrors.passwordError === '' && inputErrors.serverError === ''){
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{marginLeft: '6px'}}>Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            try{
                const response = await axios.post('https://meetzflow.com/account/endpoint/newSignUp', inputState, {withCredentials: true})
                dataStorage({
                    loggedIn: true,
                    name: inputState.name,
                    email: inputState.email
                })
                setBtn(<i className="bi bi-check-lg"></i>)
                setSuccessMessage(`An email is sent to ${inputState.email} for account verification. Check Spam folder if you don't find the email.`)
            } catch (error) {
                if(error.response.data.error.hasOwnProperty('keyPattern')){
                    setErrors(() => ({...inputErrors, emailError: 'Account with this email already exists'}))
                } else {
                    setErrors(() => ({...inputErrors, serverError: 'Unable to create the account due to some server error'}))
                }
                setBtn('Create Account')
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
                <h2><b>Create Account</b></h2>
                <InputFields key='name' inputState={inputState} name='name' errorState={errors} error='nameError' type='text' margin='mb-3' placeholder='Full Name' setInputState={setInputState}/>
                <InputFields key='email' inputState={inputState} name='email' errorState={errors} error='emailError' type='email' margin='mb-3' placeholder='Email' setInputState={setInputState}/>
                <InputFields key='password' inputState={inputState} name='password' errorState={errors} error='passwordError' password={true} type={passwordType} passwordVisibility={passwordVisibility} placeholder='Password' setInputState={setInputState}/>
                <span className="error" style={{textAlign: 'center'}}>{errors.serverError}</span>
                <span className="success" style={{textAlign: 'center'}}>{successMessage}</span>
                <button type="submit" onClick={e => handleClick(e)} disabled={isBtnDisabled}>{btn}</button>
                <p className="my-2 text-center">By signing up you agree to our <Link to='/privacy-policy' className="purple-text" style={{textDecoration: 'none'}}>Privacy Policy</Link> and <Link to='/terms-and-conditions' className="purple-text" style={{textDecoration: 'none'}}>Terms And Conditions</Link></p>
                <p className="mb-0 text-center">Already have an account? <Link to='/login' className="purple-text" style={{textDecoration: 'none'}}>Log In</Link></p>
            </form>
        </div>
    )
}

export default Signup