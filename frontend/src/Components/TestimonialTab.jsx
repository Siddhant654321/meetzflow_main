import '../styles/testimonialTab.css';
const TestimonialTab = ({name, review, backgroundColor, src}) => {
    return (
        <div className="col-md-4 mb-5 mb-md-0 d-flex align-items-stretch">
            <div className="card testimonial-card">
                <div className="card-up" style={{backgroundColor}}></div>
                <div className="avatar mx-auto bg-white">
                    <img src={src} className="rounded-circle img-fluid" />
                </div>
                <div className="card-body">
                    <h4 className="mb-4">{name}</h4>
                    <hr />
                    <p className="dark-grey-text mt-4">
                        <i className="bi bi-quote me-1 fs-5"></i>{review}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TestimonialTab;