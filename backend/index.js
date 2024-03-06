import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to MeetzFlow')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is started on port', process.env.MONGO || 3000)
})
