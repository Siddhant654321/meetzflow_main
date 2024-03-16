import React, {useState, useEffect} from 'react';
import '../styles/item.css';
import Pagination from './Pagination';
import CreateNewTeamButton from './CreateNewTeamButton';
import CreateNewSchedulerButton from './CreateNewSchedulerButton';
import DeleteItemButton from './DeleteItemButton';
import teamName from '../utilities/teamName'
import {useNavigate} from 'react-router-dom';
import CopyLink from './CopyLink';
import formatDate from '../utilities/formatDate'
import formatTime from '../utilities/formatTime'
import moment from 'moment-timezone'

const Item = ({name, content, limit, className, dataChanged, pagination, noNewBtn, changeData}) => {
    const [data, setData] = useState(() => null)
    const [arrayLength, setArrayLength] = useState(() => (content.length + dataChanged) < limit ? (content.length + dataChanged) : limit);
    const [startingPoint, setStartingPoint] = useState(() => 0);
    const [noItems, setNoItems] = useState(() => false)
    const navigate = useNavigate();
    const [showSchedulerLink, setShowSchedulerLink] = useState(() => false)
    const [schedulerName, setSchedulerName] = useState(() => null)

    const handleNotificationClick = (path) => {
        if(path === 'profile'){
            navigate('/app/profile/')
        } else if(path === 'meeting'){
            navigate('/app/meetings/')
        } else if(path === 'scheduler'){
            navigate('/app/meetings/')
        } else if(path === 'team'){
            navigate('/app/teams/')
        } 
    }

    const handleShowLink = (name) => {
        setSchedulerName(name)
        setShowSchedulerLink(true)
    }

    useEffect(() => {
        if(Array.isArray(content) && !noItems){
            const myArray = content.slice(startingPoint, arrayLength)
            const arrayData = myArray.map((element, index) => {
                if(name === 'Notifications'){
                    let time = new Date(element.time)
                    time = moment(time).tz("America/Los_Angeles").toDate();
                    let formattedTime = formatDate(time, true) + ' ' + formatTime(time)
                    return (
                        <div key={element._id} className={index !== (myArray.length - 1) ? 'item-container item-container-mobile item-bottom-border' : 'item-container item-container-mobile'}>
                            <div className='item-name'><p>{element.notification}</p></div>
                            <div className='item-time'><p>{formattedTime}</p></div>
                            <div className="break-line-flex"></div>
                            <div className='view-btn view-btn-mobile'><button onClick={() => handleNotificationClick(element.criteria)}>View</button></div>    
                        </div>
                    )
                } else if(name === 'Meetings'){
                    let time = new Date(element.time)
                    time = moment(time).tz("America/Los_Angeles").toDate();
                    let formattedTime = formatDate(time, true) + ' ' + formatTime(time)
                    return (
                        <div key={element._id} className={index !== (myArray.length - 1) ? 'item-container item-container-mobile item-bottom-border' : 'item-container item-container-mobile'}>
                            <div className='item-name'><p>Meeting with {element.scheduledBy}</p></div>
                            <div className='item-time'><p>{formattedTime}</p></div>
                            <div className="break-line-flex"></div>
                            <div className='view-btn view-btn-mobile'><button onClick={() => navigate(`/app/meetings/${element._id}`)}>View</button></div>    
                        </div>
                    )
                } else if(name === 'Schedulers'){
                    return (
                        <div key={element._id} className='item-container'>
                            <div className='item-name'><p>{element.schedulerName}</p></div>
                            <div><button onClick={() => handleShowLink(element.schedulerName)} className='scheduler-link-btn'><i className="bi bi-link-45deg"></i></button></div>
                            <DeleteItemButton category='Scheduler' name={element.schedulerName} />
                            <div className='view-btn'><button onClick={() => navigate(`/app/meetings/scheduler/update/${element.schedulerName}`)}>Edit</button></div>    
                        </div>
                    )
                } else {
                    const team = teamName(element.team)
                    return (
                        <div key={element._id} className='item-container'>
                            <div className='item-name'><p>{element.team}</p></div>
                            {element.isAdmin && <DeleteItemButton category='Teams' name={element.team} />}
                            <div className='view-btn'><button onClick={() => navigate(`/app/teams/${team}/chat`)}>View</button></div>    
                        </div>
                    )
                }
            });
            setData(arrayData)
        } else {
            setData(() => <p className='content'>{content}</p>)
        }
    }, [startingPoint, arrayLength, dataChanged, noItems])

    return (
        <div className={`${className} item-div-main`}>
            <div className='title'>
                <p>{name}</p>
                {noNewBtn ? null : name === 'Schedulers' ? <CreateNewSchedulerButton /> : <CreateNewTeamButton content={content} />}
            </div>
            <div className='content-class'>
                {data}
                {showSchedulerLink && <CopyLink path={`/schedule/${schedulerName}`} />}
                {Array.isArray(content) && content.length > limit ? (
                    <div className='d-flex justify-content-center my-3'>
                    {pagination ? (
                        <Pagination limit={limit} setArrayLength={setArrayLength} length={content.length} setStartingPoint={setStartingPoint} />
                    ) : (
                        <button className='view-more-btn align-middle'>View More <i className="bi bi-arrow-right-circle"></i></button>
                    )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Item;