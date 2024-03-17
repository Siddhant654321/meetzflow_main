import '../styles/chatDate.css'

const ChatDate = ({date}) => {
    return (
        <div className='chat-date-header'>
            <p className='chat-date-text'>{date}</p>
        </div>
    )
}

export default ChatDate;