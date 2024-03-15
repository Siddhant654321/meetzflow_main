import { Modal, Button } from "react-bootstrap"
import '../styles/modal.css'
import { useNavigate } from 'react-router-dom'

const AlertPopup = ({body, header, saveBtn, showPopup, setShowPopup, closeHandler}) => {
    const navigate = useNavigate()
    
    const handleClose = () => {
        if(closeHandler === 'team'){
            navigate('/app/teams/')
        } else if(closeHandler === 'meeting'){
            navigate('/app/meetings/')
        } else if(closeHandler === 'googleAuthentication'){
            if(!localStorage.getItem('isGoogleConnected')) {
                navigate('/app/setup/')
            } else {
                navigate('/app/')
            }
        }
        setShowPopup(false)
    };

    return (
        <Modal show={showPopup} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
            {saveBtn && (
                <Button className='modal-add-new-btn' variant="secondary">
                    {saveBtn}
                </Button>
            )}
            <Button className='modal-close-btn btn btn-danger' variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AlertPopup
