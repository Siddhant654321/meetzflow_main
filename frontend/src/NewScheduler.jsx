import MySchedulerForm from './Components/MySchedulerForm';
import TimeAlert from './Components/TimeAlert'
const NewScheduler = () => {

    return (
        <>
            <TimeAlert />
            <div>
                <MySchedulerForm buttonText='Create Scheduler' headline='Create Scheduler' />
            </div>
        </>
    )
}

export default NewScheduler