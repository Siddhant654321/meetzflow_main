import express from 'express';
import auth from '../middleware/auth.js';
import teamModel from '../Models/teamModel.js'
import chatModel from '../Models/chatModel.js';
import accountModel from '../Models/accountModel.js';
import saveNotifications from '../saveNotifications.js';

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

Router.get('/team/endpoint/oneTeam/:teamName', auth, async (req, res) => {
    try {
        const teamName = decodeURIComponent(req.params.teamName)
        const team = await teamModel.findOne({
            team: teamName,
            $or: [
                { "admin.email": req.user.email },
                { "members.email": req.user.email }
            ]
        })
        if(!team){
            return res.status(404).send({noTeams: 'Team Not Found'})
        }

        return res.status(200).send(team)
    } catch (error) {
        return res.status(500).send({error: 'Server Error'})
    }
})

Router.post('/team/endpoint/new', auth, async (req, res) => {
    try {

        const teamData = {
        team: req.body.team,
        admin: [{
            name: req.user.name,
            email: req.user.email
        }],
        members: []
        };

        const newTeam = new teamModel(teamData);
        const team = await newTeam.save();
        await new chatModel({teamId: team._id, teamName: team.team}).save()
        return res.status(201).send({success: 'Team created successfully!'});
    } catch (error) {
        return res.status(500).send({error: 'Server Error'});
    }
});

Router.patch('/team/endpoint/newMember', auth, async (req, res) => {
    try {
        const {email, name} = req.user;
        const team = await teamModel.findOne({team: req.body.team, 'admin.email': email})
        if(team === null){
            return res.status(404).send({noTeam: 'No Such Team Exist'})
        }
        const member = await accountModel.findOne({email: req.body.memberEmail})
        if(member === null){
            return res.status(404).send({noAccount: 'Account with this email does not exist'})
        }
        if (team.admin.find(admin => admin.email === req.body.memberEmail) || 
            team.members.find(member => member.email === req.body.memberEmail)) {
            return res.status(400).send({memberExist: 'Member already exists'});
        }
        team.members.push({name: member.name, email: req.body.memberEmail})
        await team.save();
        await saveNotifications(`You have been added to Team ${req.body.team} by ${name}`, 'team', member._id);
        return res.status(200).send('Member Added Successfully')
    } catch (error) {
        return res.status(500).send({error: 'Server Error'})
    }
})

export default Router