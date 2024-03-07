import express from 'express';
import accountModel from '../Models/accountModel.js';
import getToken from '../token.js';
import mongoose from '../../mongoose.js';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import verificationEmail from '../EmailTemplate/verificationEmail.js';
import multer from 'multer';

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

Router.get('/endpoint/verifyEmail/:code/:email', async (req, res) => {
    try {
        const { code, email } = req.params;
        let user = await accountModel.findOne({ email });

        if(!user) {
            return res.status(400).send({error: 'User not found'});
        }

        if(user.status === 'active'){
            return res.status(400).send({error: 'Your Account is already verified'})
        }

        if(!user.verificationCode){
            return res.status(200).send({expired: 'Verification code expired'})
        }
        const isMatch = await bcrypt.compare(code, user.verificationCode);

        if(isMatch) {
            if(Date.now() <= user.verificationCodeExpires){
                user.status = 'active';
                user.verificationCode = undefined;
                user.verificationCodeExpires = undefined;
                await user.save();
                return res.send({success: 'Email verified successfully'});
            }
            else{
                user.status = 'deletedCode';
                user.verificationCode = undefined;
                user.verificationCodeExpires = undefined;
                await user.save();
                return res.status(200).send({expired: 'Verification code expired'});
            }
        } else {
            return res.status(400).send({error: 'Invalid verification code'});
        }
    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
});

Router.post('/endpoint/account/newVerificationCode', async (req,res) => {
    try {
        const code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
        const verificationCode = await bcrypt.hash(code, 8);
        let user = await accountModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ error: 'User Not Found With This Email'});
        }
        if(user.status === 'active'){
            return res.status(400).send('Email is already verified')
        }
        user.verificationCode = verificationCode;
        user.status = 'pending'
        user.verificationCodeExpires = Date.now() + 24*60*60*1000
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.email,
            from: 'admin@meetzflow.com',
            subject: 'Verify Your Email - MeetzFlow',
            text: `Please verify your email address to get access to features like team collaboration and meeting scheduling - https://meetzflow.com/verify/${code}/${user.email}`,
            html: verificationEmail(code, user.email, user.name)
        };
        sgMail.send(msg);
        await accountModel(user).save();
        res.status(201).send({success: 'Email Sent Successfully'})
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

Router.post('/endpoint/account/forgot-password', async (req,res) => {
    try{
        const user = await accountModel.findOne({ email: req.body.email })
        if(!user){
            return res.status(400).send({error: 'Account with this email not Found'})
        }
        const code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
        const forgotPasswordCode = await bcrypt.hash(code, 8);
        user.forgotPasswordCode = forgotPasswordCode;
        user.forgotPasswordCodeExpires = Date.now() + 24*60*60*1000
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.email,
            from: 'admin@meetzflow.com',
            subject: 'Change Your Password - MeetzFlow',
            text: `Please follow this link to set a new password - https://meetzflow.com/change-password/${code}/${user.email}`,
            html: forgotPassword(code, user.email)
        };
        sgMail.send(msg);
        await accountModel(user).save();
        res.status(201).send({success: 'Email Sent Successfully'})
    } catch (error) {
        res.status(500).send({error: 'Server Error Occured'})
    }
});

Router.patch('/endpoint/change-password/:code/:email', async (req, res) => {
    try {
        const { code, email } = req.params;
        let user = await accountModel.findOne({ email });

        if(!user) {
            return res.status(400).send({error: 'User not found'});
        }

        if(!user.forgotPasswordCode){
            return res.status(400).send({expired: 'Verification code expired. Please request a new one by heading to Login page and clicking on Forgot Password Link.'})
        }

        const isMatch = await bcrypt.compare(code, user.forgotPasswordCode);

        if(isMatch) {
            if(Date.now() <= user.forgotPasswordCodeExpires){
                const password = await bcrypt.hash(req.body.password, 8);
                const token = getToken(user._id)
                user.tokens.push({token})
                user.password = password;
                user.forgotPasswordCode = undefined;
                user.forgotPasswordCodeExpires = undefined;
                await user.save();
                await saveNotifications('You have changed your password', 'profile', req.userId);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                res.cookie('token', token, {
                    httpOnly: true,
                    expires: expirationDate,
                    sameSite: 'Lax'
                })
                return res.send({success: 'Password Changed successfully', name: user.name, email: user.email});
            }
            else{
                user.forgotPasswordCode = undefined;
                user.forgotPasswordCodeExpires = undefined;
                await user.save();
                return res.status(400).send({error: 'Password reset link has expired'});
            }
        } else {
            return res.status(400).send({error: 'Invalid verification code'});
        }
    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
});

Router.post('/account/endpoint/login', async (req, res) => {
    try {
        const user = await accountModel.findOne({email: req.body.email})
        if(await bcrypt.compare(req.body.password, user.password)){
            const {status} = user;
            if(status !== 'active'){
                return res.status(400).send({emailError: 'Your email is not verified. Please verify it before performing any action'})
            }
            const token = getToken(user._id)
            user.tokens.push({token})
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            res.cookie('token', token, {
                httpOnly: true,
                expires: expirationDate,
                sameSite: 'Lax'
            })
            await user.save()
            return res.status(201).send({name: user.name, email: user.email, isGoogleConnected: user.googleAuthorizationCode ? true : false})
        }
        throw new Error()
    } catch (error) {
        res.status(400).send({error: 'Either email or password is wrong'})
    }
});

const storage = multer.diskStorage({
    destination: `./avatars/`,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          if (err) return cb(err);
          cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

const upload = multer({storage: storage});

export default Router;