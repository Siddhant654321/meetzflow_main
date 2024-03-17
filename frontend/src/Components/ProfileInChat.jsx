import {useState} from 'react';
import ProfilePic from '../assets/download.png'
import '../styles/profileInChat.css'
import useAxios from '../CustomHooks/useAxios'
import AlertPopup from './AlertPopup'
import {Link, useNavigate} from 'react-router-dom'

const ProfileInChat = ({image, isAdmin, online, name, admin, email, teamName, setShowMenu, isOnline}) => {

    const axios = useAxios();
    const [btn, setBtn] = useState(() => 'Remove');
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const [showError, setShowError] = useState(() => false)
    const [error, setError] = useState(() => '');
    const [makeAdminBtn, setMakeAdminBtn] = useState(() => 'Make Admin');
    const [isMakeAdminDisabled, setIsMakeAdminDisabled] = useState(() => false)
    const navigate = useNavigate();

    const handleRemove = async () => {
        try {
            const endpoint = admin ? 'removeAdmin' : 'removeMember';
            setIsBtnDisabled(true);
            setBtn(<div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>)
            const data = {
                team: teamName,
                memberEmail: email
            }
            await axios.patch(`/team/endpoint/${endpoint}`, data, {withCredentials: true});
            setBtn(<><i className="bi bi-check-lg"></i></>)
        } catch (error) {
            setIsBtnDisabled(false)
            setBtn('Remove')
            handleError(true)
            setError(error.response.data.message)
        }
    }

    const handleError = (action) => {
        setShowMenu(!action)
        setShowError(action)
    }

    const handleMakeAdmin = async () => {
        setIsMakeAdminDisabled(true);
        setMakeAdminBtn(<div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>)
        try{
            await axios.patch(`/team/endpoint/newAdmin`, {team: teamName, memberEmail: email}, { withCredentials: true})
            setMakeAdminBtn(<><i className="bi bi-check-lg"></i></>)
        } catch (error) {
            setIsMakeAdminDisabled(false)
            setMakeAdminBtn('Make Admin')
            handleError(true)
            if(error.response.data.hasOwnProperty('noTeam')){
                setError(error.response.data.noTeam)
            } else if(error.response.data.hasOwnProperty('noAccount')){
                setError(error.response.data.noAccount)
            } else if(error.response.data.hasOwnProperty('memberExist')){
                setError(error.response.data.memberExist)
            } else {
                setError('Server Error')
            }
        }
    }

    return (
        <div className='profile-in-chat'>
            <Link to={`/app/profile/${email}`}><img className="modal-profile-pics" src={image ? image : ProfilePic} /></Link>
            <div className='modal-profile-data'>
            <p><span style={{cursor: 'pointer'}} onClick={() => navigate(`/app/profile/${email}`)}>{name}</span>{isOnline && <span className='online-user'> &#x2022;</span>}</p>{online && (<span className='online-user'> &#x2022;</span>)}
            </div>
            {admin ? <p className='admin-text-style'>Admin</p> : isAdmin ? <button className='make-admin-btn' onClick={handleMakeAdmin} disabled={isMakeAdminDisabled}>{makeAdminBtn}</button> : null}
            {isAdmin && 
            <button className='remove-member-btn' disabled={isBtnDisabled} onClick={handleRemove}>{btn}</button>}
            <AlertPopup body={error} header='Error' showPopup={showError} setShowPopup={handleError} />
        </div>
    )
}

export default ProfileInChat;