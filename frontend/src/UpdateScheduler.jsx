import { useState, useEffect } from 'react';
import MySchedulerForm from './Components/MySchedulerForm';
import MySpinner from './Components/MySpinner'
import useFetchScheduler from './CustomHooks/useFetchScheduler.js';
import {useParams} from 'react-router-dom';
import AlertPopup from './Components/AlertPopup';
import TimeAlert from './Components/TimeAlert';

const UpdateScheduler = () => {

    const [templateVariables, setTemplateVariables] = useState(() => ({
        schedulerName: null,
        meetingTitle: 'This is the title',
        meetingDescription: 'This is description',
        daysInAdvance: 365,
        daysArray: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeStartAndEnd: [],
    }));
    const [closeHandler, setCloseHandler] = useState(() => null);
    const [isFetchingData, setIsFetchingData] = useState(() => true);
    const [updateError, setUpdateError] = useState(() => null)
    const [showPopupError, setShowPopupError] = useState(() => false)
    const fetchData = useFetchScheduler(useParams().name, setTemplateVariables, setIsFetchingData, setUpdateError);

    useEffect(() => {
        if(updateError){
            setCloseHandler('meeting')
            setShowPopupError(true)
        }
    }, [updateError])

    if(isFetchingData){
        return (
            <>
                <MySpinner className='not-full-width' />
                <AlertPopup body={updateError} closeHandler={closeHandler} header='Error' showPopup={showPopupError} setShowPopup={setShowPopupError} />
            </>
        )
    }

    return (
        <>
            <TimeAlert />
            <div>
                <MySchedulerForm buttonText='Update Scheduler' headline='Update Scheduler' update={templateVariables} oldDaysArray={templateVariables.daysArray} oldTime={templateVariables.timeStartAndEnd} />
            </div>
        </>
    )
}

export default UpdateScheduler