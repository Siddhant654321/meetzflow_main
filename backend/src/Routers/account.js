import express from 'express';
import accountModel from '../Models/accountModel.js';
import getToken from '../token.js';
import mongoose from '../../mongoose.js';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import verificationEmail from '../EmailTemplate/verificationEmail.js';

const Router = express.Router();

Router.post('/account/endpoint/newSignUp', async (req, res) => {
    try {
        const _id = new mongoose.Types.ObjectId();
        const token = getToken(_id);
        const code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
        const verificationCode = await bcrypt.hash(code, 8);
        const password = await bcrypt.hash(req.body.password, 8)
        const user = await accountModel({_id, ...req.body, password, tokens: [{token}], verificationCode, verificationCodeExpires: Date.now() + 24*60*60*1000 }).save();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.email,
            from: 'admin@meetzflow.com',
            subject: 'Verify Your Email - MeetzFlow',
            text: `Please verify your email address to get access to features like team collaboration and meeting scheduling - https://meetzflow.com/verify/${code}/${user.email}`,
            html: verificationEmail(code, user.email, user.name)
        };
        sgMail.send(msg);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        res.cookie('token', token, {
            httpOnly: true,
            expires: expirationDate,
            sameSite: 'Lax'
        })
        return res.status(201).send({message: 'Account Created Successfully!'})
    } catch (error) {
        res.status(400).send({error})
    }
})

export default Router;