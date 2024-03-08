import express from 'express';
import 'dotenv/config';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AccountRouter from './src/Routers/account.js';
import ScheduleRouter from './src/Routers/schedule.js';

const corsOptions = {
    origin: 'https://meetzflow.com', 
    credentials: true
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use(AccountRouter)
app.use(ScheduleRouter)

app.get('/', (req, res) => {
    res.send('Welcome to MeetzFlow')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is started on port', process.env.PORT || 3000)
})
