import express from 'express';
import auth from '../middleware/auth.js';
import teamModel from '../Models/teamModel.js'


const Router = new express.Router();

Router.get('/team/endpoint/allTeams', auth, async (req, res) => {
    try {
        const teams = await teamModel.find({
            $or: [
                { "admin.email": req.user.email },
                { "members.email": req.user.email }
            ]
        })
        if(!teams.length){
            return res.status(200).send({noTeams: 'You do not have any team yet'})
        }

        const allTeams = teams.map(team => {
            const isAdmin = team.admin.some(admin => admin.email === req.user.email);
            return {...team._doc, isAdmin};
        });

        return res.status(200).send({teams: allTeams})
    } catch (error) {
        return res.status(500).send({error: 'Server Error'})
    }
})