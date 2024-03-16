const formatDate = (inputDate, includeDate=false) => {
    const currentDate = new Date();
    
    let options = includeDate 
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { month: 'long', day: 'numeric', year: 'numeric' };
  
    if ( inputDate.getDate() === currentDate.getDate() && inputDate.getMonth() === currentDate.getMonth() &&  inputDate.getFullYear() === currentDate.getFullYear()) {
        return 'Today'
    } else if (inputDate.getFullYear() === currentDate.getFullYear()) {
        options.year = undefined;
        return inputDate.toLocaleDateString(undefined, options);
    } else {
        return inputDate.toLocaleDateString(undefined, options);
    }
  }
  
  export default formatDate;