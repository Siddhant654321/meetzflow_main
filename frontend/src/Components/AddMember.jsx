import { useState } from 'react';
import InputFields from "./InputFields";
import { Modal, Button } from "react-bootstrap";
import useAxios from '../CustomHooks/useAxios';

const AddMember = ({showAddMember, setShowAddMember, teamName, newMember, setNewMember}) => {
    const [inputState, setInputState] = useState(() => ({email: ''}))
    const [errors, setErrors] = useState(() => ({emailError: ''}))
    const [btn, setBtn] = useState(() => 'Add Member')
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const axios = useAxios();
    const [success, setSuccess] = useState(() => '')
    const [memberRole, setMemberRole] = useState(() => 'member')

    const handleChange = (event) => {
        setMemberRole(event.target.value);
    }

    const handleClick = async () => {
        try{
            setSuccess('')
            setErrors({emailError: ''})
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{marginLeft: '6px'}}>Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            const endpoint = memberRole === 'member' ? 'newMember' : 'newAdmin';
            await axios.patch(`/team/endpoint/${endpoint}`, {team: teamName, memberEmail: inputState.email},{withCredentials: true})
            setSuccess('Member added successfully to the team!')
            setNewMember((prev) => prev+1)
            setBtn('Add Member')
            setIsBtnDisabled(false)
        } catch (error) {
            if(error.response.data.hasOwnProperty('noAccount')){
                setErrors({emailError: error.response.data.noAccount})
            } else if (error.response.data.hasOwnProperty('noTeam')){
                setErrors({emailError: error.response.data.noTeam})
            } else {
                setErrors({emailError: error.response.data.memberExist})
            }
            setBtn('Add Member')
            setIsBtnDisabled(false)
        }
    }

    return (
            <Modal show={showAddMember} onHide={() => setShowAddMember(false)} centered>
            <Modal.Header closeButton>
            <Modal.Title>Add Member</Modal.Title>
            </Modal.Header>
            <Modal.Body className="add-new-member-div">
                <InputFields key='email' inputState={inputState} margin='mb-3' name='email' errorState={errors} error='emailError' type='email' layout='col-12' placeholder='User Email' setInputState={setInputState}/>
                <select className="form-select mb-2" value={memberRole} onChange={handleChange} aria-label="Member Role">
                    <option value='member' selected>Member</option>
                    <option value="admin">Admin</option>
                </select>
                <span className='text-center text-success mb-2'>{success}</span>
                <button disabled={isBtnDisabled} onClick={handleClick} className="submit-btn add-new-member-btn" type="submit">{btn}</button>
            </Modal.Body>
            <Modal.Footer>
            <Button className='modal-close-btn btn btn-danger' variant="secondary" onClick={() => setShowAddMember(false)}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddMember;