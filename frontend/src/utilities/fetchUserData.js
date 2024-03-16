import axios from "axios";


const fetchUserData = async (userEmail) => {
    try {
        const response = await (axios.get(`https://meetzflow.com/account/endpoint/${userEmail}`));
        let userDetails = {...response.data}
        if(userDetails.organization === null){
            delete userDetails.organization;
        }
        if(userDetails.role === null){
            delete userDetails.role;
        }
        if(userDetails.avatar !== null){
            userDetails.avatar = `https://meetzflow.com/avatars/${userEmail}/${response.data.avatar}`
        } else {
            delete userDetails.avatar
        }
        return(userDetails)
    } catch (error) {
        if(error.response.status == 404){
            return ({error: 'User Not Found With This Email'})
        } else if (error.response.status === 401) {
            return { error: "You are unauthorized to perform this action" };
        } else if (error.response.data.hasOwnProperty('emailError')) {
            return { error: "Please confirm your email before you proceed" };
        } else if(error.response.data.hasOwnProperty('googleAuthenticationError')) {
            return {error: 'googleAuthenticationError'}
        } else{
            return ({error: 'Server Error'})
        }
    }
}

export default fetchUserData