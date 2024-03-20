import { useState, useEffect, useLayoutEffect } from 'react';
import MyCalendar from './Components/MyCalendar';
import 'react-calendar/dist/Calendar.css';
import './styles/schedulerTemplate.css';
import InputFields from './Components/InputFields';
import useFetchScheduler from './CustomHooks/useFetchScheduler';
import {useParams} from 'react-router-dom';
import MySpinner from './Components/MySpinner';
import validator from 'email-validator';
import axios from 'axios';
import timeZoneList from './utilities/timeZoneList';
import AlertPopup from './Components/AlertPopup'
import useHandleMeetingBooking from './CustomHooks/useHandleMeetingBooking';
import config from './config';

const SchedulerTemplate = () => {
    const today = new Date()
    const [timeZones, setTimeZones] = useState(() => [])
    const schedulerName = useParams().name;
    const [templateVariables, setTemplateVariables] = useState(() => ({
        minDate: today,
        maxDate: null,
        selectedDate: today,
        meetingTitle: 'This is the title',
        meetingDescription: 'This is description',
        scheduledBy: '',
        schedulerEmail: '',
        scheduler: schedulerName,
        timeZone: '',
        daysArray: '',
        timeAllowed: [],
        time: '',
        email: '',
        bookedTime: []
    }));
    const [isFetchingData, setIsFetchingData] = useState(() => true);
    const [errors, setErrors] = useState(() => ({scheduledByError: '', schedulerEmailError: '', timeAllowedError: ''}))
    const fetchData = useFetchScheduler(schedulerName, setTemplateVariables, setIsFetchingData);
    const [timeArray, setTimeArray] = useState(() => [])
    const [btn, setBtn] = useState(() => 'Schedule Meeting')
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false);
    const [showPopup, setShowPopup] = useState(() => false);
    const [popupData, setPopupData] = useState(() => ({body: '', header: ''}))
    const handleMeetingBooking = useHandleMeetingBooking(templateVariables.timeAllowed)
    const handleTimeZone = (e) => {
        setTemplateVariables(prev => ({...prev, timeZone: e.target.value}))
    };

    const handleTime = (e) => {
        setTemplateVariables(prev => ({...prev, time: e.target.value}))
    }

    useEffect(() => {
        const timeZonesJSX = timeZoneList.map(timeZone => <option value={timeZone} key={timeZone}>{timeZone}</option>)
        setTimeZones(timeZonesJSX)
    }, [])

    useEffect(() => {
        handleMeetingBooking({selectedDate: templateVariables.selectedDate, data: templateVariables, setData: setTemplateVariables}, false)
    }, [templateVariables.timeZone])

    useLayoutEffect(() => {
        if(templateVariables.timeAllowed !== ''){
            const newTimeArray = templateVariables.timeAllowed.map(time => <option value={time} key={time}>{time}</option>)
            setTimeArray(newTimeArray)
        }
    }, [templateVariables.timeAllowed])

    const isTileDisabled = ({ activeStartDate, date, view }) => {
        if(templateVariables.daysArray !== ''){   
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return !templateVariables.daysArray.includes(daysOfWeek[date.getDay()]) && view === 'month'
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        let inputErrors = { ...errors }
        if (templateVariables.scheduledBy.length <= 2) {
            inputErrors = { ...inputErrors, scheduledByError: 'Your Name should be at least 3 characters long' }
        } else {
            inputErrors = { ...inputErrors, scheduledByError: '' }
        }
        if (!validator.validate(templateVariables.schedulerEmail)) {
            inputErrors = { ...inputErrors, schedulerEmailError: 'Meeting Title should be at least 3 characters long' }
        } else {
            inputErrors = { ...inputErrors, schedulerEmailError: '' }
        } 
        if(!templateVariables.timeAllowed.includes(templateVariables.time)){
            inputErrors = { ...inputErrors, timeAllowedError: 'Sorry but this time slot is not available' }
        } else {
            inputErrors = { ...inputErrors, timeAllowedError: '' }
        } 
        setErrors(inputErrors)
        if(inputErrors.scheduledByError === '' && inputErrors.schedulerEmailError === ''){
            setBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <span style={{ marginLeft: '6px' }}>Loading...</span>
                </div>)
            setIsBtnDisabled(true)
            try{
                const response = await axios.post(`${config.backend_url}/meetings/endpoint/new`, {...templateVariables, scheduler: schedulerName})
                setPopupData({body: response.data, header: 'Scheduled'})
                setShowPopup(true)
                setBtn(<><span>Meeting Scheduled </span> <i className="bi bi-check-lg"></i></>)
            } catch (error){
                setPopupData({body: error.response.data.error, header: 'Error'})
                setShowPopup(true)
                setIsBtnDisabled(false)
                setBtn('Schedule Meeting')
            }
        }
    }

    if(isFetchingData){
        return <MySpinner className='full-width' />
    }

    return (
        <div>
            <AlertPopup body={popupData.body} header={popupData.header} showPopup={showPopup} setShowPopup={setShowPopup} />
            <form style={{maxWidth: '100%', width: '100%', padding: '0px'}}>
                <h1 className='scheduler-title'>{templateVariables.meetingTitle}</h1>
                <div className='meeting-description'>
                    <p style={{margin: '0px'}}><strong>About This Meeting: </strong>{templateVariables.meetingDescription}</p>
                </div>
                <MyCalendar 
                value={templateVariables.selectedDate} 
                onChange={(nextDate) => handleMeetingBooking({selectedDate: nextDate, data: templateVariables, setData: setTemplateVariables}, true)} 
                maxDate={templateVariables.maxDate}
                minDate={templateVariables.minDate}
                className='newCalendar'
                tileDisabled={isTileDisabled}
                />
                <div className='meeting-details'>
                    <InputFields key='scheduledBy' inputState={templateVariables} name='scheduledBy' errorState={errors} error='scheduledByError' type='text' margin='mb-3' placeholder='Your Name' setInputState={setTemplateVariables} />
                    <InputFields key='schedulerEmail' inputState={templateVariables} name='schedulerEmail' errorState={errors} error='schedulerEmailError' type='email' margin='mb-3' placeholder='Your Email' setInputState={setTemplateVariables} />
                    <label className="form-label">Time Zone</label>
                    <select className="form-select custom-scroll-bar mb-3" value={templateVariables.timeZone} onChange={handleTimeZone} aria-label="Select Time Zone">
                        {timeZones}
                    </select>
                    <label className="form-label">Meeting Time</label>
                    <select className="form-select custom-scroll-bar mb-3" value={templateVariables.time} onChange={handleTime} aria-label="Select Time Zone">
                        {timeArray}
                    </select>
                    <span className="error">{errors.timeAllowedError}</span>
                </div>
                <button className='mb-3' style={{width: '50%'}} type="submit" disabled={isBtnDisabled} onClick={handleClick}>{btn}</button>
            </form>

        </div>
    );
}

export default SchedulerTemplate;