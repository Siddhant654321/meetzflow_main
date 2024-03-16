import { useState } from 'react';
import MySpinner from './Components/MySpinner';
import Item from './Components/Item';
import useFetchData from './CustomHooks/useFetchData';
import TimeAlert from './Components/TimeAlert';

const Meetings = () => {

    const [isFetchingData, setIsFetchingData] = useState(() => true);
    const [meetingData, setMeetingData] = useState(() => '');
    const [schedulerData, setSchedulerData] = useState(() => '')
    const data = useFetchData({setIsFetchingData, setMeetingData, setSchedulerData});

    if(isFetchingData){
        return <MySpinner className='not-full-width' />
    }

    return (
        <>
            <TimeAlert />
            <div className='fluid-container dashboard change-min-height'>
                <div className='row justify-content-center gx-3 align-items-start' style={{flex: '1'}}>
                    <Item name='Meetings' pagination={true} noNewBtn={true} className='minimum-heighted-div col-10' limit={12} content={meetingData} />
                    <Item name='Schedulers' pagination={true} className='minimum-heighted-div col-10' limit={12} content={schedulerData} />
                </div>
            </div>
        </>
    )
}

export default Meetings;