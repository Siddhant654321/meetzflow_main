import { useState } from "react"
import useAxios from "../CustomHooks/useAxios";
import AlertPopup from "./AlertPopup";

const DeleteItemButton = ({name, category}) => {
    const [unexpectedError, setUnexpectedError] = useState(() => null);
    const [isBtnDisabled, setIsBtnDisabled] = useState(() => false)
    const axios = useAxios();
    const [btn, setBtn] = useState(() => <i className="bi bi-trash-fill"></i>);
    const [errorPopup, setErrorPopup] = useState(() => false);

    const handleDelete = async () => {
        try{
            setBtn(<div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>)
            setIsBtnDisabled(true)
            if(category === 'Teams'){
                const response = await axios.delete('/team/endpoint/deleteTeam', {data: { team: name }} , {withCredentials: true});
            } else if(category === 'Scheduler'){
                if(name.includes(" ")){
                    setErrorPopup(true)
                    setUnexpectedError('This Scheduler does not exist')
                }
                const response = await axios.delete(`/schedule/endpoint/${name}`, {withCredentials: true});
            }
            setBtn(<i className="bi bi-check-lg"></i>)
        } catch (error){
            setIsBtnDisabled(false)
            setBtn(<i className="bi bi-trash-fill text-danger"></i>)
            if(error.response.status === 404 && category === 'Scheduler'){
                setErrorPopup(true)
                setUnexpectedError('This Scheduler does not exist')
            }
            if(error.response.status === 404 && category === 'Teams'){
                setErrorPopup(true)
                setUnexpectedError('This Team does not exist')
            }
        }
    }

    return (
        <div>
            <button disabled={isBtnDisabled} onClick={handleDelete} className="btn btn-outline-danger rounded-circle" style={{padding: '7px 11px', marginLeft: '15px'}}>{btn}</button>
            <AlertPopup body={unexpectedError} header='Error' showPopup={errorPopup} setShowPopup={setErrorPopup} />
        </div>
    )
}

export default DeleteItemButton