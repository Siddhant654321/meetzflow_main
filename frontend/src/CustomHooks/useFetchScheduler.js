import {useLayoutEffect} from 'react';
import useAxios from './useAxios';
import {useNavigate} from 'react-router-dom'

const useFetchScheduler = (schedulerName, setTemplateVariables, setIsFetchingData, setUpdateError) => {
    const axios = useAxios();
    const navigate = useNavigate();
    let success = 'pending';
    const createTimeArray = (startTime, endTime) => {
        const timeArray = [];
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
      
        let currentHour = startHour;
        let currentMinute = startMinute;
      
        while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
          const formattedTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
          timeArray.push(formattedTime);
      
          currentMinute += 30;
          if (currentMinute === 60) {
            currentHour++;
            currentMinute = 0;
          }
        }
        return timeArray;
    }
    useLayoutEffect(() => {
        const fetchData = async () => {
            try{
                const {data} = await axios.get(`/schedule/endpoint/${schedulerName}`, { withCredentials: true})
                const currentDate = new Date();
                const futureDate = new Date();
                futureDate.setDate(currentDate.getDate() + data._doc.daysInAdvance);
                setTemplateVariables(prev => ({...prev, ...data._doc, email: data.email, bookedTime:data.bookedTime, maxDate: futureDate, timeStartAndEnd: [data._doc.timeAllowed[0], data._doc.timeAllowed[1]], timeAllowed: createTimeArray(data._doc.timeAllowed[0], data._doc.timeAllowed[1])}))
                setIsFetchingData(false)
                success = 'success'
            } catch(error) {
                if(error.response.data.hasOwnProperty('noScheduler') && setUpdateError){
                    setUpdateError(error.response.data.noScheduler)
                } else {
                    navigate('/')
                } 
                success = 'failed'
            }
        }
        fetchData();
    }, [])
    return success;
}

export default useFetchScheduler;