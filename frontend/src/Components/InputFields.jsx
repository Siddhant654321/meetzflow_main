import { useEffect, useState } from 'react';
import '../styles/error.css'

const InputFields = ({name, disabled, password, type, placeholder, inputState, setInputState, layout, margin, passwordVisibility, errorState, error, additionalText}) => {
    
    const [hasError, setHasError] = useState(() => false)

    const changeInput = (e) => {
        setInputState((prev) => ({...prev, [name]: e.target.value}))
    }

    useEffect(() => {
        if(error){
            if (error.length >= 1) {
                setHasError(true);
            } else {
            setHasError(false);
            }
        }
    }, [error])

    return (
        <div className={`form-group ${layout}`}>
            <div className={`input-group ${layout} ${margin}`}>
                <div className={`form-floating`}>
                    <input disabled={disabled} type={type} className="form-control" value={inputState[name]} onChange={changeInput} id={`floating${name}`} placeholder={placeholder} />
                    <label htmlFor={`floating${name}`}>{placeholder}</label>
                    {password &&
                        <button type="button" className={`btn btn-white position-absolute top-50 end-0 translate-middle-y password-btn ${hasError ? 'has-error' : ''}`} onClick={passwordVisibility}>
                        {type === 'password' ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                        </button>
                    }
                    <span className="error">{errorState ? errorState[error] : null}</span>
                </div>
                {additionalText && 
                    <span className="input-group-text">{additionalText}</span>
                }
            </div>
        </div>
    )
}

export default InputFields;