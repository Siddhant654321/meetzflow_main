import { useState, useLayoutEffect } from 'react';
import InputFields from './InputFields';
import '../styles/schedulerForm.css'
import MultipleSelects from './MultipleSelects';
import TimeSelector from './TimeSelector';
import useAxios from '../CustomHooks/useAxios';
import AlertPopup from './AlertPopup';
import CopyLink from './CopyLink';

const MySchedulerForm = ({ buttonText, headline, update, oldDaysArray=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], oldTime=['0:00', '23:30'] }) => {
    
    
    const [inputState, setInputState] = useState(() => ({ schedulerName: '', meetingTitle: '', meetingDescription: '', daysInAdvance: 365 }))
    const [errors, setErrors] = useState(() => ({ 'schedulerNameError': '', 'meetingTitleError': '', 'meetingDescriptionError': '', 'daysExcludedError': '', 'daysInAdvanceError': ''}))
    const [btn, setBtn] = useState(() => buttonText)
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false);
    const [time, setTime] = useState(() => oldTime);
    const [daysArray, setDaysArray] = useState(() => oldDaysArray);
    const axios = useAxios();
    const [showSuccess, setShowSuccess] = useState(() => false)
    const [popupError, setPopupError] = useState(() => null)
    const [showPopupError, setShowPopupError] = useState(() => false)
    
    useLayoutEffect(() => {
        if(update){
            setInputState({...update})
        }
    }, [])

    const handleClick = async (e) => {
        e.preventDefault();
        let inputErrors = { ...errors }
        if (inputState.schedulerName.length <= 2) {
            inputErrors = { ...inputErrors, schedulerNameError: 'Scheduler Name should be at least 3 characters long' }
        } else if(inputState.schedulerName.includes(" ")) {
            inputErrors = { ...inputErrors, schedulerNameError: 'Scheduler Name cannot contain any spaces' }
        } else {
            inputErrors = { ...inputErrors, schedulerNameError: '' }
        }
        if (inputState.meetingTitle.length <= 2) {
            inputErrors = { ...inputErrors, meetingTitleError: 'Meeting Title should be at least 3 characters long' }
        } else {
            inputErrors = { ...inputErrors, meetingTitleError: '' }
        }
        if (inputState.meetingDescription.length <= 5) {
            inputErrors = { ...inputErrors, meetingDescriptionError: 'Meeting Description should be at least 6 characters long' }
        } else {
            inputErrors = { ...inputErrors, meetingDescriptionError: '' }
        }
        if(daysArray.length === 0){
            inputErrors = { ...inputErrors, daysExcludedError: 'Please select at least one day'}
        } else {
            inputErrors = { ...inputErrors, daysExcludedError: ''}
        }
        if(Number.isNaN(inputState.daysInAdvance)){
            inputErrors = { ...inputErrors, daysInAdvanceError: 'Only Numbers are allowed'}
        } else if (inputState.daysInAdvance <= 0) {
            inputErrors = { ...inputErrors, daysInAdvanceError: 'At least 1 should be entered to ensure proper functionality'}
        } else {
            inputErrors = { ...inputErrors, daysInAdvanceError: ''}
        }
        setErrors(inputErrors)
        if (inputErrors.schedulerNameError === '' && inputErrors.meetingTitleError === '' && inputErrors.meetingDescriptionError === '' && inputErrors.daysExcludedError === '' && inputErrors.daysInAdvanceError === '') {
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span style={{ marginLeft: '6px' }}>Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            try {
                if(update){
                    await axios.patch(`/schedule/endpoint/${inputState.schedulerName}`, {...inputState, daysArray: daysArray, timeAllowed: time}, {withCredentials: true})
                } else {
                    const response = await axios.post('/schedule/endpoint/new', {...inputState, daysArray: daysArray, timeAllowed: time}, {withCredentials: true})
                }
                setBtn(<>Scheduler Created <i className="bi bi-check-lg"></i></>)
                setShowSuccess(true)
            } catch (error) {
                if(error.response.data.hasOwnProperty('spaceDetected')){
                    setPopupError(error.response.data.spaceDetected)
                } else if (error.response.data.hasOwnProperty('alreadyExists')){
                    setPopupError(error.response.data.alreadyExists)
                } 
                setShowPopupError(true)
                setIsBtnDisabled(false)
                setBtn(buttonText)
            }
        }
    }

    return (
        <div className='scheduler-form-bg'>
        {showSuccess && <CopyLink path={`/schedule/${inputState.schedulerName}`} />}
        <AlertPopup body={popupError} header='Error' showPopup={showPopupError} setShowPopup={setShowPopupError} />
            <form className='scheduler-form'>
                <h2><b>{headline}</b></h2>
                <InputFields key='schedulerName' inputState={inputState} name='schedulerName' errorState={errors} error='schedulerNameError' type='text' margin='mb-3' placeholder='Scheduler Name' setInputState={setInputState} />
                <InputFields key='meetingTitle' inputState={inputState} name='meetingTitle' errorState={errors} error='meetingTitleError' type='email' margin='mb-3' placeholder='Meeting Title' setInputState={setInputState} />
                <InputFields key='meetingDescription' inputState={inputState} name='meetingDescription' errorState={errors} error='meetingDescriptionError' margin='mb-3' type='text' placeholder='Meeting Detail' setInputState={setInputState} />
                <InputFields key='daysInAdvance' inputState={inputState} name='daysInAdvance' errorState={errors} error='daysInAdvanceError' type='number' margin='mb-3' placeholder='Advance Booking Limit' setInputState={setInputState} additionalText='days' />
                <div className='mb-3'>
                    <label className="form-label">Days Availability</label>
                    <div className="selectgroup selectgroup-pills">
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Monday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Tuesday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Wednesday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Thursday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Friday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Saturday'/>
                        <MultipleSelects daysArray={daysArray} setDaysArray={setDaysArray} title='Sunday'/>
                    </div>
                    <span className="error">{errors.daysExcludedError}</span>
                </div>
                <label className="form-label">Time Availability</label>
                <TimeSelector time={time} setTime={setTime} />
                <button type="submit" disabled={isBtnDisabled} onClick={handleClick}>{btn}</button>
            </form>
        </div>
    )
}

export default MySchedulerForm;