import {useState, useEffect} from "react";
import { Modal, Button } from "react-bootstrap";
import MySpinner from "./MySpinner";
import '../styles/modal.css';
import useAxios from '../CustomHooks/useAxios'
import ProfileInChat from "./ProfileInChat";
import '../styles/customScroller.css';
import AddMember from './AddMember';
import AlertPopup from './AlertPopup';
import {useNavigate} from 'react-router-dom';

const MenuModal = ({teamName, showMenu, setShowMenu, onlineMembers}) => {
    const handleClose = () => setShowMenu(false);
    const [showAddMember, setShowAddMember] = useState(() => false)
    const [members, setMembers] = useState(() => <MySpinner className='members-loading-spinner' />)
    const [isAdmin, setIsAdmin] = useState(() => false)
    const axios = useAxios();
    const [newMember, setNewMember] = useState(() => 1)
    const [exitTeamBtn, setExitTeamBtn] = useState(() => 'Exit Team')
    const [isExitBtnDisabled, setIsExitBtnDisabled] = useState(() => false)
    const [showError, setShowError] = useState(() => false)
    const [error, setError] = useState(() => '')
    const navigate = useNavigate();
    const [allMembers, setAllMembers] = useState(() => ({members: [], admin: []}))

    const handleAddMember = (action) => {
        setShowAddMember(action)
        setShowMenu(!action)
    }

    const setMemberList = (listOfAdmin, listOfMember, isAdmin, onlineMembers) => {
        let adminList = listOfAdmin.map(admin => {
            const isOnline = onlineMembers.includes(admin.email)
            return <ProfileInChat key={admin.email} isOnline={isOnline} isAdmin={isAdmin} setShowMenu={setShowMenu} teamName={teamName} admin={true} name={admin.name} email={admin.email} image={admin.avatar ? `https://meetzflow.com/avatars/${admin.email}/${admin.avatar}` : null} />
        })
        let memberList = listOfMember.map(member => {
            const isOnline = onlineMembers.includes(member.email)
            return <ProfileInChat key={member.email} isOnline={isOnline} isAdmin={isAdmin} setShowMenu={setShowMenu} teamName={teamName} name={member.name} email={member.email} image={member.avatar ? `https://meetzflow.com/avatars/${member.email}/${member.avatar}` : null} />
        })
        setMembers(<>
            {adminList}
            {memberList}
        </>)
    }

    useEffect(() => {
        const getMembers = async () => {
            try{
                const members = await axios.get(`/team/endpoint/getMembers/${teamName}`, {withCredentials: true});
                setIsAdmin(members.data.isAdmin)
                setAllMembers({members: members.data.members, admin: members.data.admin})
                setMemberList(members.data.admin, members.data.members, members.data.isAdmin, [])
            } catch (error) {
                setMembers(<div style={{textAlign: 'center', margin: '15px 0px 8px 0px'}}>
                    <p>Sorry, but we are unable to find your team</p>
                </div>)
            }
        }
        getMembers();
    }, [newMember])

    useEffect(() => {
        setMemberList(allMembers.admin, allMembers.members, isAdmin, onlineMembers)
    }, [onlineMembers])

    const handleError = (action) => {
        setShowMenu(!action)
        setShowError(action)
    }

    
    const handleExit = async () => {
        try {
            setIsExitBtnDisabled(true);
            setExitTeamBtn(<div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>)
            const data = {
                team: teamName
            }
            await axios.patch(`/team/endpoint/exitTeam`, data, {withCredentials: true});
            setExitTeamBtn(<><i className="bi bi-check-lg"></i></>);
            navigate('/app/teams')
        } catch (error) {
            setIsExitBtnDisabled(false)
            setExitTeamBtn('Exit Team')
            handleError(true)
            setError(error.response.data.message)
        }
    }

    return (
        <div>
            <Modal show={showMenu} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>{teamName}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-chat custom-scroll-bar">
                    <div className="modal-body-chat">
                        <div className="modal-heading-members">
                            <h1>Members</h1>
                        </div>
                        <div className="modal-main-body">
                        {members}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                {isAdmin ? 
                <Button onClick={() => handleAddMember(true)} className='modal-add-new-btn' variant="secondary">
                    Add New Member
                </Button> : 
                <Button className='btn btn-danger' onClick={handleExit} disabled={isExitBtnDisabled}>
                    {exitTeamBtn}
                </Button>}
                <Button className='modal-close-btn btn btn-danger' variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <AddMember showAddMember={showAddMember} setShowAddMember={handleAddMember} teamName={teamName} newMember={newMember} setNewMember={setNewMember} />
            <AlertPopup body={error} header='Error' showPopup={showError} setShowPopup={handleError} />
        </div>
    )
}

export default MenuModal
