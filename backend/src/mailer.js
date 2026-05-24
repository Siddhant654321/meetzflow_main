import mailjet from 'node-mailjet';

let cachedClient;

const getMailjetClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Mailjet credentials are missing. Set MAILJET_API_KEY and MAILJET_API_SECRET.');
  }

  cachedClient = mailjet.apiConnect(apiKey, apiSecret);
  return cachedClient;
};

const getDefaultSender = () => {
  const email = process.env.MAILJET_SENDER_EMAIL || 'admin@meetzflow.com';
  const name = process.env.MAILJET_SENDER_NAME || 'MeetzFlow';

  return { Email: email, Name: name };
};

const normalizeRecipients = (to) => {
  if (Array.isArray(to)) {
    return to.map((email) => ({ Email: email }));
  }

  return [{ Email: to }];
};

export const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  if (!to || !subject) {
    throw new Error('Email "to" and "subject" are required.');
  }

  const message = {
    From: getDefaultSender(),
    To: normalizeRecipients(to),
    Subject: subject
  };

  if (replyTo) {
    message.ReplyTo = typeof replyTo === 'string' ? { Email: replyTo } : replyTo;
  }

  if (text) {
    message.TextPart = text;
  }

  if (html) {
    message.HTMLPart = html;
  }

  return getMailjetClient()
    .post('send', { version: 'v3.1' })
    .request({ Messages: [message] });
};
