import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './styles/homepage.css';
import FeaturesScreen from "./Components/FeaturesScreen";
import TestimonialTab from "./Components/TestimonialTab";
import FAQs from "./Components/FAQs";
import review_image_1 from './assets/1593244516682.jpeg'
import review_image_2 from './assets/20231013_150829_0001-min (1).png'
import review_image_3 from './assets/IMG_20231013_152123.png'
import MySpinner from "./Components/MySpinner";

const Homepage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => false)
    const [isLoading, setIsLoading] = useState(() => true)
    const animationRef = useRef(null)

    useLayoutEffect(() => {
        if (localStorage.getItem('loggedIn')) {
            setIsLoggedIn(true)
        }
    }, [])

    useLayoutEffect(() => {
        if(!isLoading){
            const {hash} = window.location;
            const element = document.getElementById(hash?.replace("#", ""));
            if(element){
                window.scrollTo({
                    top: element.offsetTop,
                    behavior: 'smooth'
                })
            }
        }
    }, [isLoading])

    useEffect(() => {
        if (animationRef && animationRef.current) {
            const changeLoading = () => {
                setIsLoading(false)
            }
            animationRef.current.addEventListener("ready", changeLoading)
        }
    }, [animationRef])


    return (
        <div>
            {isLoading && <MySpinner className='full-width' />}
            <div className='container'>
                <div style={{ display: isLoading && 'none' }}>
                    <div className="row" style={{minWidth: "100%", margin: '0px'}}>
                        <div className='col-md-6 my-auto'>
                            <h1 className='homepage-main-heading' style={{ fontSize: '50px' }}>Connect <span className='purple-text'>Seamlessly</span></h1>
                            <h4 className='homepage-secondary-heading'>With your <span className='purple-text'>Clients</span> and <span className='purple-text'>Team</span> members</h4>
                            <div className='homepage-btn'>
                                {isLoggedIn ?
                                    <Link className="btn custom-bg-button btn-primary" type="button" to='/app'>Dashboard</Link> :
                                    <>
                                        <Link className="btn custom-bg-button btn-primary get-started" type="button" to='/get-started'>Create Account</Link>
                                        <Link className="btn custom-bg-button btn-primary" type="button" to='/login'>Log in</Link>
                                    </>
                                }
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <dotlottie-player ref={animationRef} src="https://lottie.host/bf8a6707-3188-4880-baad-c6be5311d44f/8ZVPDFZxYo.json" background="transparent" speed="1" style={{ width: '100%' }} loop autoplay></dotlottie-player>
                        </div>
                    </div>
                    <h1 className="my-3 homepage-headings" id="features">Features</h1>
                    <FeaturesScreen
                        imageOn='right'
                        title="Connect With Clients"
                        text="Our Tool lets you create a new Scheduler that you can share with your prospects and schedule meetings with them only on days and times when you are available."
                        lottieAnimation='https://lottie.host/1b09b01e-8564-42a8-9a56-4414d67772b5/0G4itaKvZJ.lottie'
                    />
                    <FeaturesScreen
                        imageOn='left'
                        title="Team Collaboration"
                        text="Create a team where you can discuss your next projects and make strategies for growing your company. Add and remove admins and members, and schedule meetings with all your colleagues in just one place."
                        lottieAnimation='https://lottie.host/9dc0b08b-82fa-4d25-821b-2867b19e1d56/nd9D4dLxdk.lottie'
                    />
                    <FeaturesScreen
                        imageOn='right'
                        title="Multiple Teams"
                        text="Want to have a different team for every department in your company? Or want a different place to hang out with your colleagues in your free time? Don't worry, we have got you covered. Create as many teams as you want to"
                        lottieAnimation='https://lottie.host/a1e9fa29-5dab-4cfd-956c-2dbd0f5e0f1c/b0FrRhVGey.lottie'
                    />
                    <FeaturesScreen
                        imageOn='left'
                        title="All-In-One Dashboard"
                        text="You will find Your upcoming and past meetings, your teams, your notifications and your schedulers all in one place, totally organized for you to give you a boost of productivity"
                        lottieAnimation='https://lottie.host/bec97ed0-8af6-4362-8e61-19423be7b6c5/Ys6nFhEhMQ.lottie'
                        customHeight="380px"
                        marginTop='-20px'
                    />
                    <h1 className="mb-3 homepage-headings" style={{marginTop: '-50px'}} id="testimonials">Testimonials</h1>
                    <div className="row text-center d-flex align-items-stretch" style={{minWidth: "100%", margin: '0px'}}>
                        <TestimonialTab backgroundColor="#4255c1" name='Aditya Singh' review="Offers a very easy-to-use interface and has got some of the best features." src={review_image_1} />
                        <TestimonialTab backgroundColor="#6f42c1" name='Alina Reed' review="Team collaboration has been made very easy since we started using MeetzFlow." src={review_image_2} />
                        <TestimonialTab backgroundColor="#42c1b2" name='Andrew Williams' review="It solved my biggest problem, that was scheduling meetings with my clients." src={review_image_3} />
                    </div>
                    <h1 className="my-3 homepage-headings" id="faq">FAQs</h1>
                    <div className={`accordion ${isLoggedIn ? '' : 'mb-3'}`} id="accordionExample" style={{paddingBottom: isLoggedIn ? '70px' : '0px'}}>
                        <FAQs id="collapseOne" question='How can I get started?' answer='Firstly create an account. We will send an email on your registered mail to verify your account. Once you have verified your account, you will be prompted to connect your Google Calendar account. Once you connect your Google Calendar account, you will be good to go.' />
                        <FAQs id="collapseTwo" question='How team collaboration works?' answer='You can easily create a team, add your members and admins in the team and then, you can freely chat with them, schedule internal meetings and share images all in one dashboard.' />
                        <FAQs id="collapseThree" question='Do I need a Google account?' answer='Yes, you must have a Google account in order to use our features.' />
                        <FAQs id="collapseFour" question='Which timezone is used in the dashboard?' answer='We use the Pacific Time throughout our dashboard' />
                        <FAQs id="collapseFive" question='Is the software free to use?' answer='Yes, at the moment the software is absolutely free to use without any limitations. We do not want money to create an entry-barrier and stop people from trying our great software.' />
                    </div>
                    {!isLoggedIn &&
                        <div className="text-center mt-5">
                            <h1 className="mb-3 mt-4">Connect better with your <span className='purple-text'>Clients</span> and <span className='purple-text'>Colleagues</span></h1>
                            <p className="mb-3 m-auto" style={{ maxWidth: '650px' }}>We await you! Discover a set of features that will help you boost your productivity and get better results for your company at no cost.</p>
                            <div className="m-auto" style={{ width: 'fit-content', paddingBottom: '90px' }}>
                                <Link className="btn custom-bg-button btn-primary get-started" type="button" to='/get-started'>Create Account</Link>
                                <Link className="btn custom-bg-button btn-primary" type="button" to='/login'>Log in</Link>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Homepage