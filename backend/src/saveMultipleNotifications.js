import accountModel from './Models/accountModel.js';
import moment from 'moment-timezone';

const saveMultipleNotifications = async (notification, criteria, emails) => {
    const time = moment().tz("America/Los_Angeles").format();
    const data = {notification,criteria,time};
    await accountModel.updateMany({ email: { $in: emails } }, { $push: { notifications: data } });
}


export default saveMultipleNotifications;