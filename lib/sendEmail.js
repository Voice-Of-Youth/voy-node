
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '460790994249-0l7br797vo1pqktju7o3bjd5dk3ub105.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04wpGrxHZgzDDCgYIARAAGAQSNwF-L9IrXlenwshBMnBMblcV5QWU1rTGgZcU5fY1luLk_COPxEjvU0ewJQ_4-lXDt_cEp397jbI'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
 
//send email
exports.sendingMail = async (email, token, content, subject) => {
    try {
        const accesToken = await oAuth2Client.getAccessToken();
	
        const mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'voiceofyouth.ethiopia@gmail.com', // Your email id
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accesToken,
                // pass: '**Appdev#024680' // Your password
            }
        });
    
        const mailOptions = {
            from: 'voiceofyouth.ethiopia@gmail.com',
            to: email,
            subject: subject,
            html: content
            // html: ''
        };
    
        return await mail.sendMail(mailOptions);
    } catch (error) {
        return error
    }	
}

