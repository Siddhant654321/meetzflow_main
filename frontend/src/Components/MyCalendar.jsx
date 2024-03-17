import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/myCalendar.css'

const MyCalendar = ({value, onChange, maxDate, minDate, className, tileDisabled}) => {

    return (
        <div className='cal-bg'>
            <Calendar
                onClickDay={onChange}
                value={value}
                minDetail='year'
                minDate={minDate}
                maxDate={maxDate}
                prev2Label={null}
                next2Label={null}
                className={className}
                tileDisabled={tileDisabled}
            />
        </div>
    );
}

export default MyCalendar