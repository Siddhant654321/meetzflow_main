import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAxios from './useAxios'


const useFetchData = ({setMeetingData, setTeamData, setSchedulerData, setNotificationData, setIsFetchingData}) => {
    const navigate = useNavigate();
    const axios = useAxios();
    let result = 'pending'

    useEffect(() => {
        const fetchData = async () => {
            try{
                const meetings = setMeetingData ? await axios.get('/meetings/endpoint/all',  { withCredentials: true}) : undefined;
                const schedulers = setSchedulerData ? await axios.get('/schedule/endpoint/allSchedulers',  { withCredentials: true}) : undefined;
                const teams = setTeamData ? await axios.get('/team/endpoint/allTeams',  { withCredentials: true}) : undefined;
                const notifications = setNotificationData ? await axios.get('/account/endpoint/notifications',  { withCredentials: true}) : undefined;
                if(meetings){
                    if (meetings.data.hasOwnProperty('noMeeting')) {
                        setMeetingData('You have no Meetings')
                    } else {
                        setMeetingData(meetings.data.meetings)
                    }
                }
                if(schedulers){
                    if (schedulers.data.hasOwnProperty('noScheduler')) {
                        setSchedulerData('You have no Schedulers')
                    } else {
                        setSchedulerData(schedulers.data.schedulers)
                    }
                }
                if(teams){
                    if (teams.data.hasOwnProperty('noTeams')) {
                        setTeamData('You have no Teams')
                    } else {
                        setTeamData(teams.data.teams)
                    }
                }
                if(notifications){
                    if (notifications.data.hasOwnProperty('noNotification')) {
                        setNotificationData('You have no Notifications')
                    } else {
                        setNotificationData(notifications.data.notifications)
                    }
                }
                setIsFetchingData(false)
            } catch (error) {
                result = 'failed'
            }
        }
        fetchData()
    }, [])
    result = 'success'
    return result;
}

export default useFetchData;