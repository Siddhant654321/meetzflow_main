import {useState} from 'react';
import {Link} from 'react-router-dom';
import AlertPopup from './AlertPopup';
import '../styles/copyLink.css'

const CopyLink = ({path}) => {

    const [showPopup, setShowPopup] = useState(() => true);
    const [btn, setBtn] = useState(() => <i className="bi bi-clipboard-fill"></i>)
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)

    const handleClick = async () => {
        setBtn(<i className="bi bi-check-lg"></i>)
        setIsBtnDisabled(true)
        try {
            await navigator.clipboard.writeText(`https://meetzflow.com${path}`)
        } catch (error) {
            alert('Failed to copy link to clipboard')
        }
        setTimeout(() => {
            setBtn(<i className="bi bi-clipboard-fill"></i>)
            setIsBtnDisabled(false)
        }, 1000)
    }
    
    const clipboard = (
        <div className='copy-to-clipboard'>
            <Link to={path}>{`https://meetzflow.com${path}`}</Link>
            <button onClick={handleClick} disabled={isBtnDisabled}>{btn}</button>
        </div>
    )
    
    return (
        <AlertPopup body={clipboard} header='Scheduler' showPopup={showPopup} setShowPopup={setShowPopup} />
    )
}

export default CopyLink;