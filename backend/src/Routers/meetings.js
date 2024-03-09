import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment-timezone';
import { google } from 'googleapis';
import meetingModel from '../Models/meetingModel.js';
import accountModel from '../Models/accountModel.js';
import saveNotifications from '../saveNotifications.js';
import getOAuthClient from '../getOAuthClient.js';

const Router = new express.Router();

Router.post('/meetings/endpoint/new', async (req, res) => {
    try {
        const _id = new mongoose.Types.ObjectId();
        const account = await accountModel.findOne({email: req.body.email});
        if(!account){
            return res.status(404).send({error: 'Account with this email does not exist'})
        }
        const selectedDate = moment(req.body.selectedDate).format('YYYY-MM-DD');
        const userTimeZone = req.body.timeZone; 
        const startDateTime = moment.tz(`${selectedDate} ${req.body.time}`, 'YYYY-MM-DD HH:mm', userTimeZone);
        const endDateTime = startDateTime.clone().add(60, 'minutes');
        const formattedStartTime = startDateTime.clone().tz("America/Los_Angeles").toISOString();
        const formattedEndTime = endDateTime.clone().tz("America/Los_Angeles").toISOString();
        const pacificTime = startDateTime.clone().tz("America/Los_Angeles").format();
        const oauth2Client = getOAuthClient(account.googleAuthorizationCode)
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const event = {
        summary: req.body.meetingTitle, // Title of the meeting
        description: req.body.meetingDescription, // Description of the meeting
        start: {
            dateTime: formattedStartTime, // Start time in ISO format
            timeZone: 'America/Los_Angeles', // Time zone of the start time
        },
        end: {
            dateTime: formattedEndTime, // End time in ISO format
            timeZone: 'America/Los_Angeles', // Time zone of the end time
        },
        attendees: [
            { email: req.body.schedulerEmail }
        ],
        conferenceData: {
                createRequest: {
                requestId: _id.toString(), // A unique identifier for the request
                conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        try {
            const googleData = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1, // Indicates that conference data (Google Meet link) should be returned
            });
            await meetingModel({...req.body, time: pacificTime, _id, meetingLink: googleData.data.hangoutLink}).save();
            await saveNotifications(`${req.body.scheduledBy} has scheduled a new meeting with you`, 'meeting', account._id);
            res.status(201).send(`Meeting scheduled successfully. Join Link - ${googleData.data.hangoutLink}`);
        } catch (err) {
            throw new Error('Meeting cannot be scheduled due to unforeseen error');
        }

    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
})

export default Router;