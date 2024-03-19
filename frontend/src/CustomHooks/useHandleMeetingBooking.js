import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

const useHandleMeetingBooking = (timeAllowed) => {
    const [initialArray, setInitialArray] = useState(() => [])

    useEffect(() => {

        if(timeAllowed.length >= initialArray.length){
            setInitialArray([...timeAllowed])
        }
    }, [timeAllowed])

    return ({selectedDate, data, setData}, changeDate = false) => {
        const momentDateInSelectedTimezone = moment(selectedDate).tz(data.timeZone || "America/Los_Angeles");
        const pacificDate = momentDateInSelectedTimezone.clone().tz("America/Los_Angeles");    
        if(changeDate){
            setData((prev) => ({...prev, selectedDate: selectedDate, timeAllowed: [...initialArray]}))
        } else {
            setData((prev) => ({...prev, timeAllowed: [...initialArray]}))
        }
        const pacificDateData = {
            date: pacificDate.date(),
            month: pacificDate.month(),
            year: pacificDate.year(),
            hour: pacificDate.hour(),
            minute: pacificDate.minute()
        };

        if(data.bookedTime.length !== 0){
            let finalFilteredTime = [...initialArray] || [...data.timeAllowed] 
            data.bookedTime.forEach(dateFromDB => {
                
                const dbDate = moment.tz(dateFromDB, "America/Los_Angeles");
                const dbDateInSelectedTimeZone = dbDate.tz(data.timeZone || "America/New_York");
                const dbDateData = {
                    date: dbDate.date(),
                    month: dbDate.month(),
                    year: dbDate.year(),
                    hour: dbDateInSelectedTimeZone.get('hour'),
                    minute: dbDateInSelectedTimeZone.get('minute')
                };

                if (dbDateData.date === pacificDateData.date &&
                    dbDateData.month === pacificDateData.month &&
                    dbDateData.year === pacificDateData.year) {
                    const timeString = `${String(dbDateData.hour).padStart(2, '0')}:${String(dbDateData.minute).padStart(2, '0')}`;
                    let filteredTime = finalFilteredTime.filter(dateStr => {
                        if (timeString === dateStr) {
                            return false
                        }
                        
                        return true
                    })
                    finalFilteredTime = [...filteredTime]
                }
            })
            setData((prev) => ({...prev, timeAllowed: finalFilteredTime}))
        }
    }
}
export default useHandleMeetingBooking