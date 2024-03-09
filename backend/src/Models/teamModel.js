import mongoose from '../../mongoose.js';

const teamSchema = new mongoose.Schema({
    team: {
        type: String,
        required: true
    },
    admin: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }],
    members: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }]
})

const teamModel = mongoose.model('Team', teamSchema)

export default teamModel;