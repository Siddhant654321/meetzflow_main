import {useState, useLayoutEffect} from 'react';
import InputFields from './Components/InputFields';
import AlertPopup from './Components/AlertPopup';
import {useParams} from 'react-router-dom';
import fetchUserData from './utilities/fetchUserData';
import profileImage from './assets/download.png';
import MySpinner from './Components/MySpinner';


const Profile = () => {
    const [inputState, setInputState] = useState(() => ({
        name: '',
        email: '',
        organization: '',
        role: '',
        avatar: profileImage
    }))
    const {email} = useParams()
    const [isFetchingData, setIsFetchingData] = useState(() => true)
    const [userError, setUserError] = useState(() => null)
    const [showPopup, setShowPopup] = useState(() => false);


    useLayoutEffect(() => {
        if(userError){
            setShowPopup(true)
        }
    }, [userError])

    useLayoutEffect(() => {
        const fetchData = async () => {
            const response = await fetchUserData(email)
            if(response.hasOwnProperty('error')){
                setUserError(response.error)
            } else {
                setInputState(prev => ({...prev, ...response}))
            }
            setIsFetchingData(false)
        }
        fetchData();
    }, [])

    if(isFetchingData){
        return <MySpinner className='not-full-width' />
    }

    return (
        <div className='main-div'>
            <div className='main-container container-fluid'>
            <AlertPopup body={userError} header='Error' showPopup={showPopup} setShowPopup={setShowPopup} />
                <div className='img-container rounded-circle' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img style={{cursor: 'default'}} src={inputState.avatar} className='rounded-circle' alt="About" />
                </div>
                <div className='row mt-3'>
                    <InputFields key='name' inputState={inputState} disabled={true} name='name' type='text' margin='mb-3' layout='col-md-6' placeholder='Full Name' setInputState={setInputState}/>
                    <InputFields disabled={true} key='email' inputState={inputState} name='email' type='email' margin='mb-3' layout='col-md-6' placeholder='Email' setInputState={setInputState}/>
                    <InputFields key='organization' inputState={inputState} disabled={true} name='organization' type='text' margin='mb-3' layout='col-md-6' placeholder={'Organization'} setInputState={setInputState}/>
                    <InputFields key='role' inputState={inputState} disabled={true} name='role' type='text' margin='mb-3' layout='col-md-6' placeholder='Company Role' setInputState={setInputState}/>
                </div>
            </div>
        </div>
    )
}

export default Profile