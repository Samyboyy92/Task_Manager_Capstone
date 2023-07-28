
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse;



const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
console.log(accountSid)
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


app.post('/sms', (req, res) => {
    console.log('Received request at /sms endpoint');
    const { message, to } = req.body;
  
    client.messages
      .create({
        body: message,
        from: '+18669816271',
        to: req.body.to
      })
      .then(() => {
        console.log('Received request at /sms endpoint');
        res.send({ success: true });
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        res.send({ success: false });
      });
  });
  
  app.listen(port, () => console.log('Server is running on port 3001'));