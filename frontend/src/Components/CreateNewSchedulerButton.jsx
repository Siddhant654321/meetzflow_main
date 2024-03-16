import {useNavigate} from 'react-router-dom';

const CreateNewSchedulerButton = () => {
    const navigate = useNavigate();
    return (
        <button className='create-new-btn' onClick={() => navigate('/app/meetings/scheduler/new')}>Create New</button>
    )
}

export default CreateNewSchedulerButton;