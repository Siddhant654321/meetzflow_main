import express from 'express';
import 'dotenv/config';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AccountRouter from './src/Routers/account.js';
import ScheduleRouter from './src/Routers/schedule.js';
import MeetingsRouter from './src/Routers/meetings.js';
import contactRouter from './src/Routers/contact.js';
import {AuthRouter} from './src/Routers/google-auth.js';
import teamRouter from './src/Routers/team.js';
import chatRouter from './src/Routers/chat.js';
import emailModify from './src/middleware/emailModify.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: 'https://meetzflow.com', 
    credentials: true
};
const server = createServer(app);
const io = new Server(server, {cors: corsOptions});
app.options('*', cors(corsOptions));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(emailModify)

app.use(AccountRouter)
app.use(ScheduleRouter)
app.use(MeetingsRouter)
app.use(contactRouter)
app.use(AuthRouter)
app.use(teamRouter)
app.use(chatRouter)
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.send('Welcome to MeetzFlow')
})

let onlineUsers = []

io.on('connection', async (socket) => {
    let team;
    let accountName;
    const {teamName, userEmail} = socket.handshake.query
    try{
      const user = (await accountModel.findOne({email: userEmail}));
      const {_id} = user;
      accountName = user.name;
      team = await teamModel.findOne({team: teamName,
        $or: [
            { "admin.email": userEmail },
            { "members.email": userEmail }
        ]
      })
      if(!team){
        throw new Error('Team not found')
      }
      socket.join(String(team._id));
      onlineUsers.push({email: userEmail, teamId: String(team._id)})
    } catch (error) {
      socket.emit('error', 'Team Not Found')
      socket.disconnect()
      return; 
    }
  
    const emails = onlineUsers.filter(value => {
      if(value.teamId === String(team._id)){
        return value.email
      }
    })
    
    io.to(String(team._id)).emit('newOnline', emails);
  
    socket.on('sendImage', (data) => {
      const images = {image: data, from: accountName}
      socket.to(String(team._id)).emit('receiveImage', images);
    });
    
    socket.on('sendMessage', data => {
      const message = {message: data, from: accountName}
      socket.to(String(team._id)).emit('receiveMessage', message)
    })
  
    socket.on('sendMeetingMessage', data => {
      const message = {...data, from: accountName}
      socket.to(String(team._id)).emit('receiveMeetingMessage', message)
    })
  
    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(user => user.email !== userEmail);
      const emails = onlineUsers.filter(value => {
        if(value.teamId === String(team._id)){
          return value.email
        }
      })
      io.to(String(team._id)).emit('newOffline', emails);
    })
});

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log('Server is started on port', process.env.PORT || 3000)
})
