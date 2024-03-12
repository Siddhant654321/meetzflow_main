export default (data) => {
    localStorage.setItem('loggedIn', data.loggedIn)
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    if(data.isGoogleConnected){
        localStorage.setItem('isGoogleConnected', true);
    }
}