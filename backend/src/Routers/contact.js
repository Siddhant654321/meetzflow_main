import express from "express";
import { sendEmail } from '../mailer.js';

const contactRouter = new express.Router()

contactRouter.post('/contact/new/message', async (req, res) => {
    try{
        await sendEmail({
            to: 'technosys.sidd@gmail.com',
            replyTo: req.body.email,
            subject: `New Message On MeetzFlow from ${req.body.name}`,
            text: req.body.message,
            html: `<p>${req.body.message}</p>`
        });
        res.status(201).send("Message Sent Successfully!")
    } catch (error) {
        res.status(500).send("Server Error!")
    }
})

export default contactRouter