import express from 'express';
import auth from '../middleware/auth.js';
import scheduleModel from '../Models/scheduleModel.js';
import accountModel from '../Models/accountModel.js';
import meetingModel from '../Models/meetingModal.js';

const Router = new express.Router();

Router.get('/schedule/endpoint/allSchedulers', auth, async (req, res) => {
    try {
        const schedulers = await scheduleModel.find({userId: req.userId})
        if(!schedulers.length){
            return res.status(200).send({noScheduler: 'You do not have any Scheduler yet'})
        }
        res.status(200).send({schedulers})
    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
})

Router.get('/schedule/endpoint/:name', async (req, res) => {
    try{
        const scheduler = await scheduleModel.findOne({schedulerName: req.params.name})
        if(!scheduler){
            return res.status(404).send({noScheduler: 'Scheduler with this name is not found'})
        }
        const account = await accountModel.findById(scheduler.userId)
        if(!account){
            return res.status(404).send({noScheduler: 'Scheduler with this name is not found'})
        }
        const meetings = await meetingModel.find({email: account.email})
        if(meetings.length === 0){
            return res.status(200).send({...scheduler, email: account.email, bookedTime: []})
        }
        const bookedTime = meetings.map((meeting) => meeting.time)
        res.status(200).send({...scheduler, email: account.email, bookedTime})
    } catch(error){
        res.status(500).send({error: 'Server Error'})
    }
})

Router.post('/schedule/endpoint/new', auth, async (req, res) => {
    try{
        if(req.body.schedulerName.includes(" ")){
            return res.status(400).send({spaceDetected: 'Scheduler Name cannot contain spaces'})
        }
        const scheduler = await scheduleModel.findOne({schedulerName: req.body.schedulerName})
        if(scheduler){
            return res.status(400).send({alreadyExists: 'Scheduler with this name already exists'})
        }
        if(req.body.daysArray.length === 0){
            return res.status(400).send({emptyDaysArray: 'You must provide at least one day in daysArray'})
        }
        await scheduleModel({...req.body, schedulerName: req.body.schedulerName.toLowerCase(), userId: req.userId}).save();
        return res.status(201).send('Scheduler Created Successfully!')
    } catch(error){
        res.status(500).send({error: 'Server Error'})
    }
})

export default Router;