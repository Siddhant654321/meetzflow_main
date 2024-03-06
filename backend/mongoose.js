import mongoose from 'mongoose'
const mongo_url = process.env.MONGO;
mongoose.connect(mongo_url)
mongoose.set('runValidators', true);
export default mongoose;