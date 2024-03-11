import express from 'express'
import auth from '../middleware/auth.js'
import chatModel from '../Models/chatModel.js'
import getChat from '../middleware/getChat.js'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

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

const storage = multer.diskStorage({
    destination: `./chatImages/`,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          if (err) return cb(err);
          cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      files: 10
    }
});

export default Router;