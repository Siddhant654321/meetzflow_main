import { useState, useEffect, useRef, useLayoutEffect } from "react";
import './styles/chatDashboard.css'
import { useParams } from "react-router-dom";
import ChatMessages from "./Components/ChatMessages";
import ChatDate from "./Components/ChatDate";
import MenuModal from "./Components/MenuModal";
import './styles/customScroller.css';
import io from 'socket.io-client';
import formatTime from './utilities/formatTime'
import AlertPopup from './Components/AlertPopup'
import useAxios from "./CustomHooks/useAxios";
import MySpinner from './Components/MySpinner';
import formatDate from "./utilities/formatDate";
import MyCalendar from './Components/MyCalendar';
import 'react-calendar/dist/Calendar.css';
import InputFields from "./Components/InputFields";
import config from "./config";

const ChatDashboard = () => {
    let name = useParams().name;
    name = name.replace(/-/g, ' ');
    name = name.replace(/\b\w/g, (match) => match.toUpperCase());
    const [showMenu, setShowMenu] = useState(() => false)
    const scrollRef = useRef(null);
    const [inputState, setInputState] = useState(() => '')
    const socketRef = useRef();
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => true)
    const [message, setMessage] = useState(() => []);
    const [error, setError] = useState(() => null);
    const [showPopup, setShowPopup] = useState(() => false)
    const [onlineMembers, setOnlineMembers] = useState(() => [])
    const [btn, setBtn] = useState(() => <i className="bi bi-images"></i>)
    const [isImageBtnDisabled, setIsImageBtnDisabled] = useState(() => false)
    const axios = useAxios();
    const [scrollHeightBeforeNewMessages, setScrollHeightBeforeNewMessages] = useState(0);
    const [moreMessages, setMoreMessages] = useState(() => false)
    const [moreMessagesBtn, setMoreMessagesBtn] = useState(() => 'Show Previous Messages')
    const [moreMessagesDisabled, setMoreMessagesDisabled] = useState(() => false)
    const [moreMessagesClicked, setMoreMessagesClicked] = useState(() => false);
    const [isFetchingData, setIsFetchingData] = useState(() => true);
    const [closeHandler, setCloseHandler] = useState(() => null);
    const [lastMessageDate, setLastMessageDate] = useState(() => null);
    const [meetingBtn, setMeetingBtn] = useState(() => 'Schedule Meeting')
    const [isMeetingBtnDisabled, setIsMeetingBtnDisabled] = useState(() => false)
    const [showMeetingPopup, setShowMeetingPopup] = useState(() => false)
    const [meetingData, setMeetingData] = useState(() => ({selectedDate: new Date(), time: '0:00', meetingTitle: ''}))
    const [timeArray, setTimeArray] = useState(() => {
        const arr = ['0:00','0:30','1:00','1:30','2:00','2:30','3:00','3:30','4:00','4:30','5:00','5:30','6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30']
        const finalArr = arr.map(value => <option value={value} key={value}>{value}</option>)
        return finalArr
    })
    const [pageNumber, setPageNumber] = useState(() => 1)
    const [errors, setErrors] = useState(() => ({meetingTitleError: '', serverError: ''}))
    const [meetingSuccess, setMeetingSuccess] = useState(() => '')

    const fetchMessages = async (page, isShowMoreClicked = false) => {
        try{
            const teamName = encodeURIComponent(name)
            const messages = await axios.get(`/chat/endpoint/messages/${name}?page=${page}`, {withCredentials: true});
            const teamData = await axios.get(`/team/endpoint/oneTeam/${teamName}`, {withCredentials: true})
            const oldMessages = []
            let localVar = lastMessageDate;
            if(messages?.data.length < 20){
                setMoreMessages(false)
            } else {
                setMoreMessages(true)
            }
            messages?.data.reverse();
            messages?.data.forEach(message => {
                const chatTime = new Date(message.chat.time)
                const formattedDate = formatDate(chatTime)
                if(localVar !== formattedDate){
                    oldMessages.push(<ChatDate date={formattedDate} />)
                    setLastMessageDate(formattedDate)
                    localVar = formattedDate
                }
                if(message.chat.hasOwnProperty('imageMessage')){
                    return oldMessages.push(<ChatMessages key={message.chat._id} senderName={message.chat.sentByName} senderTime={formatTime(chatTime)} sender={message.chat.sentByEmail === localStorage.getItem('email') ? 'me' : 'other'} image={`${config.backend_url}/chatImages/${teamData.data._id}/${message.chat.imageMessage}`} />)
                } else if (message.chat.hasOwnProperty('meetingMessage')){
                    return oldMessages.push(<p className='meeting-message'>{message.chat.sentByEmail === localStorage.getItem('email') ? 'You have ' + message.chat.meetingMessage : `${message.chat.sentByName } has ${message.chat.meetingMessage}`} - <a href={message.chat.meetingLink}>Meeting Link</a></p>)
                }
                return oldMessages.push(<ChatMessages key={message.chat._id} senderName={message.chat.sentByName} senderTime={formatTime(chatTime)} sender={message.chat.sentByEmail === localStorage.getItem('email') ? 'me' : 'other'} message={message.chat.chatMessage} />)
            })
            if (isShowMoreClicked) {
                setScrollHeightBeforeNewMessages(scrollRef.current.scrollHeight);
            }
            setMessage(prev => [...oldMessages, ...prev])
            if(isShowMoreClicked){
                setMoreMessagesBtn('Show Previous Messages')
                setMoreMessagesDisabled(false)
            }else {

                setIsFetchingData(false)
            }
        } catch (error){
            if(error.response.data.hasOwnProperty('noTeam')){
                setShowPopup(true);
                setError('Sorry, but this team does not exist');
                setCloseHandler('team')
            }
        }
    }

    const scrollToBottom = () => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    };

    useEffect(() => {
        fetchMessages(pageNumber);
    }, [])

    useLayoutEffect(() => {
        if(!moreMessagesClicked){
            scrollToBottom();
        } else {
            const heightDifference = scrollRef.current.scrollHeight - scrollHeightBeforeNewMessages;
            scrollRef.current.scrollTop += heightDifference;
        }
    }, [message])


    useEffect(() => {
        socketRef.current = io(`${config.backend_url}/`, {
            query: {
                userEmail:  localStorage.getItem('email'),
                teamName: name
            },
            withCredentials: true
        });

        socketRef.current.on('receiveImage', (data) => {
            const chatTime = new Date();
            let newDate;
            const formattedDate = formatDate(chatTime)
            if(lastMessageDate !== formattedDate){
                newDate = <ChatDate date={formattedDate} />
                setLastMessageDate(formattedDate)
                setMessage(prev => [...prev, <> {newDate} <ChatMessages senderName={data.from} senderTime={formatTime(chatTime)} sender='other' image={data.image} /> </>]);
            } else {
                setMessage(prev => [...prev, <> <ChatMessages senderName={data.from} senderTime={formatTime(chatTime)} sender='other' image={data.image} /> </>]);
            }
            if(moreMessagesClicked){
                setMoreMessagesClicked(false)
            }
        });
        
        socketRef.current.on('receiveMessage', (data) => {
            const chatTime = new Date();
            let newDate;
            const formattedDate = formatDate(chatTime)
            if(lastMessageDate !== formattedDate){
                newDate = <ChatDate date={formattedDate} />
                setLastMessageDate(formattedDate)
                setMessage(prev => [...prev, <> {newDate} <ChatMessages senderName={data.sender} senderTime={formatTime(chatTime)} sender='other' message={data.message} /> </>])
            } else {
                setMessage(prev => [...prev, <> <ChatMessages senderName={data.sender} senderTime={formatTime(chatTime)} sender='other' message={data.message} /> </>])
            }
            if(moreMessagesClicked){
                setMoreMessagesClicked(false)
            }
            
        });

        socketRef.current.on('receiveMeetingMessage', (data)=> {
            const chatTime = new Date();
            const formattedDate = formatDate(chatTime)
            if(lastMessageDate !== formattedDate){
                setLastMessageDate(formattedDate)
                const newDate = <ChatDate date={formattedDate} />
                setMessage(prev => [...prev, <> {newDate} <p className='meeting-message'>{`${data.from} has hosted a meeting for '${data.meetingTitle}' and it will commence on ${data.meetingTime}`} - <a href={data.meetingLink}>Meeting Link</a></p></>])
            } else {
                setMessage(prev => [...prev, <p className='meeting-message'>{`${data.from} has hosted a meeting for '${data.meetingTitle}' and it will commence on ${data.meetingTime}`} - <a href={data.meetingLink}>Meeting Link</a></p>])
            }
            if(moreMessagesClicked){
                setMoreMessagesClicked(false)
            }
        })

        socketRef.current.on('newOnline', (emails) => {
            let emailArr = emails.map(obj => obj.email);
            setOnlineMembers([...emailArr])
        })

        socketRef.current.on('newOffline', (emails) => {
            let emailArr = emails.map(obj => obj.email);
            setOnlineMembers([...emailArr])
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [])

    const handleFileButtonClick = () => {
        document.getElementById('fileUpload').click();
    };
    
    const handleFileChange = async (event) => {
        let images = event.target.files;
        let imageArray = Array.from(images);

        setBtn(<div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>)
        setIsImageBtnDisabled(true)

        const data = new FormData();
        let localVar = lastMessageDate;

        imageArray.forEach((image) => {
            if (!image.type.startsWith('image/')) {
                if(!showPopup){
                    setShowPopup(true)
                    setError("Only images are allowed to be send. Any other file will not be send")
                }
                return;
            }

            data.append('files[]', image)
            data.append('time[]', new Date())
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const chatTime = new Date();
                let newDate;
                const formattedDate = formatDate(chatTime)
                if(localVar !== formattedDate){
                    newDate = <ChatDate date={formattedDate} />
                    localVar = formattedDate
                    setLastMessageDate(formattedDate)
                }
                socketRef.current.emit('sendImage', reader.result);
                if(moreMessagesClicked){
                    setMoreMessagesClicked(false)
                }
                setMessage(prev => [...prev, <> {newDate} <ChatMessages senderName={localStorage.getItem('name')} senderTime={formatTime(new Date())} sender='me' image={reader.result} /> </>])
            };
            reader.readAsDataURL(image);
        });

        data.append('team', name)

        try {
            await axios.post('/chat/endpoint/newImage', data, {withCredentials: true});
        } catch (error) {
            setShowPopup(true)
            setError(error.response?.data.error)
        }

        setIsImageBtnDisabled(false)
        setBtn(<i className="bi bi-images"></i>)

    }

    const onSend = async () => {
        socketRef.current.emit('sendMessage', inputState);
        const chatTime = new Date();
        let newDate;
        const formattedDate = formatDate(chatTime)
        if(lastMessageDate !== formattedDate){
            newDate = <ChatDate date={formattedDate} />
            setLastMessageDate(formattedDate)
        }
        if(moreMessagesClicked){
            setMoreMessagesClicked(false)
        }
        setMessage(prev => [...prev, <> {newDate} <ChatMessages senderName={localStorage.getItem('name')} senderTime={formatTime(chatTime)} sender='me' message={inputState} /> </>])
        setIsBtnDisabled(true)
        const message = inputState;
        setInputState('')
        try{
            const data = {
                team: name,
                time: new Date(),
                chatMessage: message
            }
            await axios.post('/chat/endpoint/newMessage', data, {withCredentials: true})
        } catch (error) {
            setShowPopup(true)
            setError("This Team does not exist")
        }
    }

    const handleChange = (e) => {
        setInputState(e.target.value)
        if(e.target.value.length === 0){
            setIsBtnDisabled(true)
        } else {
            setIsBtnDisabled(false)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            if (!isBtnDisabled) { 
                onSend();
            }
        }
    }

    const handleMeetingSchedule = async (e) => {
        e.preventDefault();
        if(meetingData.meetingTitle.length <= 2){
            return setErrors((prev) => ({meetingTitleError: 'Meeting title should be at least 3 characters long!'}))
        }
        setErrors(() => ({meetingTitleError: '', serverError: ''}))
        setIsMeetingBtnDisabled(true)
        setMeetingBtn(<div><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            <span style={{ marginLeft: '6px' }}>Loading...</span>
        </div>)
        try {
            const response = await axios.post('/meetings/endpoint/team/new', {...meetingData, currentTime: new Date(), team: name}, {withCredentials: true})
            const chatTime = new Date();
            const formattedDate = formatDate(chatTime)
            if(lastMessageDate !== formattedDate){
                setLastMessageDate(formattedDate)
            }
            if(moreMessagesClicked){
                setMoreMessagesClicked(false)
            }
            socketRef.current.emit('sendMeetingMessage', {meetingTime: response.data.meetingTime, meetingTitle: meetingData.meetingTitle, meetingLink: response.data.meetingLink});
            setMessage(prev => [...prev, <p className='meeting-message'>{`You have hosted a meeting for '${meetingData.meetingTitle}' and it will commence on ${response.data.meetingTime}`} - <a href={response.data.meetingLink}>Meeting Link</a></p>])
            setMeetingSuccess(() => 'Meeting Successfully Scheduled!')
            setIsMeetingBtnDisabled(true)
            setMeetingBtn(<i className="bi bi-check-lg"></i>)
        } catch (error) {
            setErrors((prev) => ({...prev, serverError: 'Some error occured!'}))
            setIsMeetingBtnDisabled(false)
            setMeetingBtn('Schedule Meeting')
        }
    }

    const today = new Date()

    const meetingPopupBody = (
        <form className='schedule-meeting-form'>
            <MyCalendar 
                value={meetingData.selectedDate} 
                onChange={(selectedDate) => setMeetingData(prev => ({...prev, selectedDate}))} 
                maxDate={new Date(new Date().setFullYear(today.getFullYear() + 1))}
                minDate={today}
                className='newCalendar mt-3 mb-4'
            />
            <InputFields key='meetingTitle' inputState={meetingData} name='meetingTitle' errorState={errors} error='meetingTitleError' type='text' margin='mb-3' placeholder='Meeting Title' setInputState={setMeetingData} />
            <label className="form-label">Meeting Time</label>
            <select className="form-select custom-scroll-bar mb-2" value={meetingData.time} onChange={(e) => setMeetingData(prev => ({...prev, time: e.target.value}))} aria-label="Select Time Zone">
                {timeArray}
            </select>
            <span className="error" style={{textAlign: 'center'}}>{errors.serverError}</span>
                <span className="success" style={{textAlign: 'center'}}>{meetingSuccess}</span>
            <button style={{width: '280px'}} disabled={isMeetingBtnDisabled} onClick={(e) => handleMeetingSchedule(e)} className="mb-2">{meetingBtn}</button>
        </form>
    )

    const showMoreMessages = async (e) => {
        e.preventDefault()
        setMoreMessagesBtn(<div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>)
        setMoreMessagesDisabled(true)
        setMoreMessagesClicked(true)
        fetchMessages(pageNumber + 1, true)
        setPageNumber(prev => prev + 1)
    }

    if(isFetchingData){
        return <MySpinner className='not-full-width' />
    }

    return (
        <div className="chat-dashboard-main-div">
            <div className="chat-dashboard-secondary-div">
                <div className="chat-header">
                    <h1>{name}</h1>
                    <button onClick={() => setShowMenu(true)}><i className='bi bi-three-dots-vertical chat-menu-icon'></i></button>
                </div>
                <AlertPopup body={error} closeHandler={closeHandler} header='Error' showPopup={showPopup} setShowPopup={setShowPopup} />
                <AlertPopup body={meetingPopupBody} header='Schedule Meeting' showPopup={showMeetingPopup} setShowPopup={setShowMeetingPopup} />
                <MenuModal teamName={name} showMenu={showMenu} setShowMenu={setShowMenu} onlineMembers={onlineMembers} />
                <div className="chat-messages-div custom-scroll-bar" ref={scrollRef}>
                    {moreMessages && <button id='show-more-btn' onClick={showMoreMessages} disabled={moreMessagesDisabled}>{moreMessagesBtn}</button>}
                    {message}
                </div>
                <div className="input-group mb-3 chat-message-form">
                    <input type="text" value={inputState} onChange={handleChange} onKeyDown={handleKeyPress} className="form-control" placeholder="Your Message" aria-label="Your Message" aria-describedby="button-addon2" />
                    <input type="file" id="fileUpload" style={{ display: 'none' }} multiple accept="image/*" onChange={handleFileChange} />
                    <button className="meeting-chat-button" type="button" id="button-addon2" onClick={() => setShowMeetingPopup(true)}><i className='bi bi-camera-video-fill'></i></button>
                    <button disabled={isImageBtnDisabled} className="insert-file-chat-button" type="button" id="button-addon2" onClick={handleFileButtonClick}>{btn}</button>
                    <button disabled={isBtnDisabled} onClick={onSend} className="chat-send-button" type="button" id="button-addon2"><i className="bi bi-send"></i></button>
                </div>
            </div>
        </div>
    )
}

export default ChatDashboard;