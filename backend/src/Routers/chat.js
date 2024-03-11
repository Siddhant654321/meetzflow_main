import express from 'express'
import auth from '../middleware/auth.js'
import chatModel from '../Models/chatModel.js'
import getChat from '../middleware/getChat.js'

const Router = new express.Router();

Router.post('/chat/endpoint/newMessage', auth, getChat, async (req, res) => {
    try{
        req.chat.chat.push({time: req.body.time, sentByName: req.account.name, sentByEmail: req.account.email, chatMessage: req.body.chatMessage})
        await chatModel.findByIdAndUpdate(req.chat._id, { chat: req.chat.chat })
        res.status(201).send('Message Saved Successfully!')
    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
})

export default Router;
