import '../styles/chatMessages.css'

const ChatMessages = ({sender, senderName, senderTime, message, image}) => {

    const senderClass = sender === 'other' ? 'sent-by-other' : 'sent-by-me'

    return (
        <>
            <div className={`${senderClass} chat-message-container`}>
                {image ? <img className="chat-message image-message" src={image} /> :
                <div className='chat-message'>
                    <p>{message}</p>
                </div>
                }
                {sender === 'other' ? 
                    <p className="chat-details">Sent by {senderName} &#x2022; {senderTime}</p> : 
                    <p className="chat-details">{senderTime} &#x2022; Sent by {senderName}</p>
                }
            </div>
        </>
    )
}

export default ChatMessages;