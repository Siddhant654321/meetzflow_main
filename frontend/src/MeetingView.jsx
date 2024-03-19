import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './styles/meetingView.css';
import MyCalendar from './Components/MyCalendar';
import 'react-calendar/dist/Calendar.css';
import MySpinner from './Components/MySpinner';
import useAxios from './CustomHooks/useAxios';
import formatTime from './utilities/formatTime';
import AlertPopup from './Components/AlertPopup';
import TimeAlert from './Components/TimeAlert';
import moment from 'moment-timezone'

const MeetingView = () => {
    const {meetingId}= useParams()
    const [isFetchingData, setIsFetchingData] = useState(() => true)
    const [meetingData, setMeetingData] = useState(() => ({scheduler: '', scheduledBy: '', schedulerEmail: '', time: '', meetingTitle: '', meetingDescription: '', date: new Date()}))
    const [showError, setShowError] = useState(() => false)
    const [errorBody, setErrorBody] = useState(() => '')
    const axios = useAxios();

    useEffect(() => {
        const fetchMeetingData = async () => {
            try{
                const response = await axios.get(`/meetings/endpoint/id/${meetingId}`, {withCredentials: true})
                let meetingDate = new Date(response.data.time)
                meetingDate = moment(meetingDate).tz("America/Los_Angeles").toDate();
                const meetingTime = formatTime(meetingDate)
                setMeetingData({...response.data, date: meetingDate, time: meetingTime})
                setIsFetchingData(false)
            } catch(error){
                if(error.response.data.hasOwnProperty('error')){
                    setErrorBody(error.response.data.error)
                    setShowError(true)
                }
            }
        }
        fetchMeetingData();
    }, [])

    if(isFetchingData){
        return(
            <>
                <MySpinner className='not-full-width' />
                <AlertPopup body={errorBody} header='Error' closeHandler='meeting' showPopup={showError} setShowPopup={setShowError} />
            </>
        ) 
    }

    return (
        <>
            <TimeAlert />
            <div className='meeting-view-div'>
                <div className='meeting-date-calendar'>
                    <h3 className='mb-4'>Date Of Meeting</h3>
                    <MyCalendar 
                        value={meetingData.date}
                        maxDate={meetingData.date}
                        minDate={meetingData.date}
                        className='newCalendar'
                    />
                </div>
                <div className='meeting-data-div'>
                    <h3 className='mt-4'>Meeting Data</h3>
                    <p className='mb-0'><i className="bi bi-person-circle meeting-data-icon"></i> Scheduled By {meetingData.scheduledBy}<br />
                    <i className="bi bi-envelope-at meeting-data-icon"></i> Scheduler's Email - {meetingData.schedulerEmail}<br />
                    <i className="bi bi-window meeting-data-icon"></i> Scheduled using Scheduler {meetingData.scheduler}<br />
                    <i className="bi bi-alarm meeting-data-icon"></i> Meeting Time - {meetingData.time}<br />
                    <i className="bi bi-camera-video meeting-data-icon"></i> Meeting Title - {meetingData.meetingTitle}<br />
                    <span className='normal-line-height'><i className="bi bi-card-text meeting-data-icon"></i> Meeting Description - {meetingData.meetingDescription}</span></p>
                    <i className="bi bi-camera-video meeting-data-icon"></i> Meeting Link - <b><a href={meetingData.meetingLink} style={{textDecoration: 'none'}}>Click Here</a></b><br />
                </div>
                <AlertPopup body={errorBody} header='Error' showPopup={showError} setShowPopup={setShowError} />
                
            </div>
        </>
    )
}

export default MeetingView;