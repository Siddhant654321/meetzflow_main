import express from 'express';
import { google } from 'googleapis';
import auth from '../middleware/auth.js'; 

const Router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production' ? 'https://meetzflow.com/api/setup/callback' : 'http://localhost:3000/api/setup/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

Router.get('/auth/google', auth, (req, res) => {
    if(req.user.googleAuthorizationCode){
      return res.status(400).send('Your Google Calendar Account is already connected')
    }
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.redirect(url);
});

export const AuthRouter = Router;