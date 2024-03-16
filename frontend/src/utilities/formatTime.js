const formatTime = (time) => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'P.M.' : 'A.M.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    return formattedTime;
}

export default formatTime;