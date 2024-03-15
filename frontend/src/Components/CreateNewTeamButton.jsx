import { useState } from 'react';
import {useDispatch} from 'react-redux';
import InputFields from './InputFields';
import '../styles/createNewTeamButton.css'
import useAxios from '../CustomHooks/useAxios'
import AlertPopup from './AlertPopup'
import { bindActionCreators } from '@reduxjs/toolkit';
import newTeamAction from '../action/newTeamAction';
import teamNameConverter from '../utilities/teamName'

const CreateNewTeamButton = ({content}) => {

    const [showPopup, setShowPopup] = useState(() => false);
    const [btn, setBtn] = useState(() => 'Create Team');
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false);
    const [inputState, setInputState] = useState(() => ({teamName: ''}));
    const [errors, setErrors] = useState(() => ({teamNameError: ''}));
    const [errorPopup, setErrorPopup] = useState(() => false);
    const [unexpectedError, setUnexpectedError] = useState(() => null);
    const axios = useAxios();
    const dispatch = useDispatch();
    const {setTeam} = bindActionCreators({
        setTeam: newTeamAction
    }, dispatch)

    const handleClick = async  () => {
        let isAlready = false;
        let newTeamName = inputState.teamName
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => {
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
        })
        .join(' ');
        if(Array.isArray(content)){
            content.forEach(teams => {
                if(teamNameConverter(teams.team) === teamNameConverter(newTeamName)){
                    isAlready = true
                }
            })
        }
        if(newTeamName.length < 2){
            setErrors({teamNameError: 'Team Name Should be at least 2 characters long'})
        } else if (isAlready) {
            setErrors({teamNameError: 'Team with this name already exists'})
        } else {
            setErrors({teamNameError: ''})
            try {
                setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span style={{marginLeft: '6px'}}>Loading...</span>
                </div>)
                setIsBtnDisabled(true)
                await axios.post('/team/endpoint/new', {team: newTeamName}, {withCredentials: true})
                setTeam(newTeamName)
                setBtn(<i className="bi bi-check-lg"></i>)
            } catch (error) {
                setIsBtnDisabled(false)
                setBtn('Create Team')
                if(error.response.status === 404){
                    setShowPopup(false)
                    setErrorPopup(true)
                    setUnexpectedError('Your Account is not found')
                }
            }
        }
    }

    const popupBody = (
        <div className='add-new-team-div'>
            <InputFields key='teamName' inputState={inputState} margin='mb-3' name='teamName' errorState={errors} error='teamNameError' type='text' layout='col-12' placeholder='Team Name' setInputState={setInputState}/>
            <button disabled={isBtnDisabled} onClick={handleClick} className="submit-btn add-new-team-btn" type="submit">{btn}</button>
        </div>
    )

    return (
        <div>
            <button className='create-new-btn' onClick={() => setShowPopup(true)}>Create New</button>
            <AlertPopup header='Create Team' body={popupBody} showPopup={showPopup} setShowPopup={setShowPopup} />
            <AlertPopup body={unexpectedError} header='Error' showPopup={errorPopup} setShowPopup={setErrorPopup} />
        </div>
    )
}

export default CreateNewTeamButton;