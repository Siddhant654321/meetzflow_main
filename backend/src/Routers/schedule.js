import express from 'express';
import auth from '../middleware/auth.js';
import scheduleModel from '../Models/scheduleModel.js';

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

export default Router;