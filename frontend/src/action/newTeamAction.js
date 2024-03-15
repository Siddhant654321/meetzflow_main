const newTeamAction = (teamName) => {
    return ((dispatch) => {
        dispatch({
            type: 'newTeam',
            payload: {
                team: teamName, 
                isAdmin: true,
                _id: Math.floor(Math.random() * 100000)
            }
        })
    })
}

export default newTeamAction;