const teamReducer = (state = null, action) => {
    if(action.type === 'newTeam'){
        return action.payload;
    }
    return state;
}

export default teamReducer;