import accountModel from './Models/accountModel.js';
import moment from 'moment-timezone';

const saveNotifications = async (notification, criteria, id) => {
    const time = moment().tz("America/Los_Angeles").format();
    const account = await accountModel.findById(id);
    account.notifications.push[{notification, criteria, time}]
    await account.save();
}


export default saveNotifications;