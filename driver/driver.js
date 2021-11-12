'use strict';

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({ region:'us-west-1' });

const sqs = new AWS.SQS();

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/889748947625/packages.fifo';

const app = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: async (message) => {
    let data = await sqs.receiveMessage(message);
    return console.log(JSON.stringify(data.params))
  },
});

app.on('error', (err) => {
  console.error(err.message);
});
app.start();
