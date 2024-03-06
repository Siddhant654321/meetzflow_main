import mongoose from '../../mongoose.js';
import validator from "email-validator";


const accountSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.validate(value)){
                throw new Error('Invalid Email')
            }
        },
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    },
    organization: {
        type: String
    },
    role: {
        type: String
    },
    avatar: {
        type: String
    },
    status: { 
        type: String, 
        default: 'pending' 
    },
    verificationCode: { 
        type: String 
    },
    verificationCodeExpires: { 
        type: Date 
    },
    forgotPasswordCode: {
        type: String
    },
    forgotPasswordCodeExpires: {
        type: Date
    },
    notifications:[{
        notification: {
            type: String
        },
        criteria: {
            type: String
        },
        time: {
            type: Date
        }
    }],
})

const accountModel = mongoose.model('Accounts', accountSchema)

export default accountModel;