import {useState} from 'react';
import { useEffect } from 'react';

const MultipleSelects = ({title, daysArray, setDaysArray}) => {

    const [className, setClassName] = useState(() => null)

    const handleClick = () => {
        setClassName(className === 'selected-btn-style' ? 'not-selected-btn-style' : 'selected-btn-style')
    }
    
    useEffect(() => {
        if(daysArray.includes(title)){
            setClassName('selected-btn-style')
        } else {
            setClassName('not-selected-btn-style')
        }
    }, [])

    useEffect(() => {
        if(className === 'selected-btn-style'){
            setDaysArray(prev => [...prev, title])
        } else {
            const newDaysArray = daysArray.filter(day => day !== title);
            setDaysArray(newDaysArray);
        }
    }, [className])

    return (
        <label className='selectgroup-item'>
            <input className="selectgroup-input" type="checkbox" name={title} value={title} checked />
            <span onClick={handleClick} className={`selectgroup-button ${className}`}>{title}</span>
        </label>
    )
}

export default MultipleSelects