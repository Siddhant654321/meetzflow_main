import express from 'express'
import auth from '../middleware/auth.js'
import chatModel from '../Models/chatModel.js'
import getChat from '../middleware/getChat.js'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
import sharp from 'sharp'
import teamModel from '../Models/teamModel.js';

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

async function compressImage(req, res, next) {
    if (!req.files) {
        return res.status(400).send('No files found in the request');
    }

    for (let file of req.files) {
        const inputPath = file.path;
        if (!fs.existsSync(`./chatImages/${req.team._id}`)) {
            fs.mkdirSync(`./chatImages/${req.team._id}`);
        }
        const outputPath = `./chatImages/${req.team._id}/compressed_${file.filename}`;

        try {
            await sharp(inputPath)
                .resize(450, null, { 
                    withoutEnlargement: true,  
                    fit: 'inside'  
                })
                .jpeg()
                .toFile(outputPath);

            fs.unlinkSync(inputPath);
            file.compressedPath = outputPath;
        } catch (error) {
            return res.status(500).send({error});
        }
    }
    next();
}

Router.post('/chat/endpoint/newImage', auth, upload.array('files[]', 10), getChat, compressImage, async (req, res) => {
    try{
        const images = req.files.map((file, index) => ({
            time: req.body.time[index],
            sentByName: req.account.name,
            sentByEmail: req.account.email,
            imageMessage: `compressed_${file.filename}`
        }));
        req.chat.chat.push(...images);
        await chatModel.findByIdAndUpdate(req.chat._id, { chat: req.chat.chat });
    
        res.status(201).send('Images Saved Successfully!');
    } catch (error) {
        res.status(500).send({error: 'Server Error'})
    }
});

Router.get('/chat/endpoint/messages/:team', auth, async (req, res) => {
    try{
        const page = req.query.page || 1;
        const chatsPerPage = 20;
        const team = await teamModel.findOne({
            team: req.params.team,
            $or: [
                {'admin.email': req.user.email},
                {'members.email': req.user.email}
            ]
        })
        if(team === null){
            return res.status(404).send({noError: 'No Such Team Exist'})
        }
        const chat = await chatModel.aggregate([
            { $match: { teamId: `${team._id}` } },
            { $unwind: "$chat" },
            { $sort: { "chat.time": -1 } },
            { $skip: (page - 1) * chatsPerPage },
            { $limit: chatsPerPage },
            { $project: { chat: 1, _id: 0 } }
        ]);
        res.send(chat)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default Router;
