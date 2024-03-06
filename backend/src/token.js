import jwt from 'jsonwebtoken';

const getToken = (_id) => {
    const token = jwt.sign({_id}, process.env.JWT_SECRET);
    return token;
}

export default getToken;