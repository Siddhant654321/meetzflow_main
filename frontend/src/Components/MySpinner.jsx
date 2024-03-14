import '../styles/spinner.css'

const MySpinner = ({className}) => {
    return (
        <div className={className}>
            <div className="spinner-grow my-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default MySpinner;