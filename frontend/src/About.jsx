import { useLayoutEffect, useState } from 'react'
import profileImage from './assets/download.png';
import './styles/about.css';
import InputFields from './Components/InputFields';
import validator from 'email-validator';
import fetchUserData from './utilities/fetchUserData';
import AlertPopup from './Components/AlertPopup';
import MySpinner from './Components/MySpinner';
import dataStorage from './utilities/dataStorage';
import useAxios from './CustomHooks/useAxios';
import { useNavigate } from 'react-router-dom';

const About = () => {

    const [inputState, setInputState] = useState(() => ({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '',
        role: '',
        avatar: profileImage
    }))
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState(() => 'password');
    const [confirmPasswordType, setConfirmPasswordType] = useState(() => 'password');
    const [errors, setErrors] = useState(() => ({'nameError': '', 'emailError': '', 'passwordError': '', 'confirmPasswordError': '', 'organizationError': '', 'roleError': '','serverError': ''}))
    const [btn, setBtn] = useState(() => 'Save')
    const [popupBody, setPopupBody] = useState(() => null)
    const [showMenuPopup, setShowMenuPopup] = useState(() => false)
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [isFetchingData, setIsFetchingData] = useState(() => true)
    const [userError, setUserError] = useState(() => null)
    const [isImageChanged, setIsImageChanged] = useState(() => false)
    const [showPopup, setShowPopup] = useState(() => false);
    const axios = useAxios();
    const [avatarImage, setAvatarImage] = useState(() => null)
    const [logoutBtn, setLogoutBtn] = useState(() => 'Log Out From All Devices')
    const [deleteBtn, setDeleteBtn] = useState(() => 'Delete Account')
    const [isLogoutBtnDisabled, setIsLogoutBtnDisabled] = useState(() => false)
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(() => false)


    const passwordVisibility = () => {
        setPasswordType(() => passwordType === 'password' ? 'text' : 'password')
    }
    const confirmPasswordVisibility = () => {
        setConfirmPasswordType(() => confirmPasswordType === 'password' ? 'text' : 'password')
    }

    useLayoutEffect(() => {
        const fetchData = async () => {
            const response = await fetchUserData(localStorage.getItem('email'))
            if(response.hasOwnProperty('error')){
                if(response.error === 'googleAuthenticationError'){
                    navigate('/app/setup')
                } else {
                setUserError(response.error)
                }
            } else {
                setInputState(prev => ({...prev, ...response}))
            }
            setIsFetchingData(false)
        }
        fetchData();
    }, [])

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
        if(inputState.password.length < 6 && inputState.password.length >= 1){
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
        if(inputErrors.nameError === '' && inputErrors.emailError === '' && inputErrors.passwordError === '' && inputErrors.serverError === ''){
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{marginLeft: '6px'}}>Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            try {
                let data;
                if(isImageChanged){
                    data = new FormData();
                    Object.entries(inputState).forEach(([key, value]) => {
                        if (value !== '' && key !== 'email') {
                            if(key === 'avatar'){
                                return data.append(key, avatarImage)
                            }
                            data.append(key, value)
                        }
                    });
                } else {
                    data = {};
                    Object.entries(inputState).forEach(([key, value]) => {
                        if (value !== '' && key !== 'email') {
                            data[key] = value;
                        }
                    });
                    delete data['avatar'];
                }
                await axios.patch('/account/endpoint/update', data, {withCredentials: true})
                dataStorage({...inputState, loggedIn: true})
                setBtn(<>Saved <i className="bi bi-check-lg"></i></>)
            } catch (error){
                setBtn('Save')
                setIsBtnDisabled(false)
                setUserError(error.response.data.error)
                setShowPopup(true)
            }
        }
    }

    useLayoutEffect(() => {
        if(userError){
            setShowPopup(true)
        }
    }, [userError])

    useLayoutEffect(() => {
        if(showMenuPopup){
            setPopupBody(<div className='about-menu-div'>
                <div><button className='btn btn-danger' onClick={logoutFromAll} disabled={isLogoutBtnDisabled}>{logoutBtn}</button></div>
                <div><button className='btn btn-danger' onClick={deleteAccount} disabled={isDeleteBtnDisabled}>{deleteBtn}</button></div>
            </div>)
        }
    }, [showMenuPopup, logoutBtn, deleteBtn])

    if(isFetchingData){
        return <MySpinner className='not-full-width' />
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInputState(prev => ({...prev, avatar: reader.result}))
            };
            reader.readAsDataURL(file);
            setIsImageChanged(true);
            setAvatarImage(file);
        } else {
            setUserError('Profile Picture must be an image');
            setShowPopup(true);
        }
    }

    const handleImageUpload = () => {
        document.getElementById('fileUpload').click();
    }

    const logoutFromAll = async () => {
        try{
            setLogoutBtn(<div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>)
            setIsLogoutBtnDisabled(true)
            await axios.get('/account/endpoint/logout-everyone', {withCredentials: true})
            localStorage.clear()
            navigate('/')
        } catch(error) {
            setUserError('Unable to delete the account due to server error');
            setShowMenuPopup(false)
            setLogoutBtn('Log Out From All Devices')
            setShowPopup(true)
        }
    }

    const deleteAccount = async () => {
        try{
            setDeleteBtn(<div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>)
            setIsDeleteBtnDisabled(true)
            await axios.delete('/account/endpoint/delete', {withCredentials: true})
            localStorage.clear()
            navigate('/')
        } catch(error) {
            setUserError('Unable to delete the account due to server error');
            setShowMenuPopup(false)
            setDeleteBtn('Delete Account')
            setShowPopup(true)
        }
    }

    return (
        <div className='main-div'>
            <div className='main-container container-fluid'>
                <button className='about-menu-icon' onClick={() => setShowMenuPopup(true)}><i className='bi bi-three-dots-vertical chat-menu-icon'></i></button>
                <AlertPopup body={popupBody} header='Your Account' showPopup={showMenuPopup} setShowPopup={setShowMenuPopup} />
                <AlertPopup body={userError} header='Error' showPopup={showPopup} setShowPopup={setShowPopup} />
                <div className='img-container rounded-circle'>
                <input type="file" id="fileUpload" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    <img src={inputState.avatar} className='rounded-circle' alt="About" />
                    <div className='edit-image col-12 rounded-circle' onClick={handleImageUpload}>
                        <h1><i className="bi bi-pencil-fill"></i></h1>
                    </div>
                </div>
                <div className='row mt-3 about-profile-form'>
                    <InputFields key='name' inputState={inputState} name='name' errorState={errors} error='nameError' type='text' margin='mb-3' layout='col-md-6' placeholder='Full Name' setInputState={setInputState}/>
                    <InputFields disabled={true} key='email' inputState={inputState} name='email' errorState={errors} error='emailError' type='email' margin='mb-3' layout='col-md-6' placeholder='Email' setInputState={setInputState}/>
                    <InputFields key='password' inputState={inputState} name='password' errorState={errors} error='passwordError' password={true} type={passwordType} passwordVisibility={passwordVisibility} margin='mb-3' layout='col-md-6' placeholder='New Password' setInputState={setInputState}/>
                    <InputFields key='confirmPassword' inputState={inputState} name='confirmPassword' errorState={errors} error='confirmPasswordError' password={true} type={confirmPasswordType} passwordVisibility={confirmPasswordVisibility} margin='mb-3' layout='col-md-6' placeholder='Confirm Password' setInputState={setInputState}/>
                    <InputFields key='organization' inputState={inputState} name='organization' errorState={errors} error='organizationError' type='text' margin='mb-3' layout='col-md-6' placeholder={'Organization'} setInputState={setInputState}/>
                    <InputFields key='role' inputState={inputState} name='role' errorState={errors} error='roleError' type='text' margin='mb-3' layout='col-md-6' placeholder='Company Role' setInputState={setInputState}/>
                    
                <button onClick={handleClick} disabled={isBtnDisabled} className="submit-btn mb-3" type="submit">{btn}</button>
                </div>
            </div>
        </div>
    )
}

export default About