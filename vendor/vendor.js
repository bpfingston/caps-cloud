'use strict';

const AWS = require('aws-sdk');
const faker = require('faker');
const uuid = require('uuid').v4;
AWS.config.update({ region: 'us-west-1' });

const sns = new AWS.SNS();
const sqs = new AWS.SQS();

const topic = 'arn:aws:sns:us-west-1:889748947625:pickup.fifo';
const queueArn = 'arn:aws:sqs:us-west-1:889748947625:mrmortonwonderemporium';
const send = async (groupId, payload) => {
    console.log(payload)
  return await sqs
    .sendMessage({
      MessageBody: `${payload}`,
      MessageGroupId: `group-${groupId}`,
      MessageDeduplicationId: `m-${groupId}-${faker.datatype.uuid()}`,
      QueueUrl:
        'https://sqs.us-west-1.amazonaws.com/889748947625/packages.fifo',
    })
    .promise();
};

const main = async (payload) => {
  try {
    let data = await send(faker.random.alphaNumeric(), payload);
    return JSON.stringify(data);
  } catch (err) {
    console.log(err);
  }
};

setInterval(() => {
  const payload = {
    orderId: uuid(),
    customer: faker.name.findName(),
    vendorId: queueArn,
    Message: faker.lorem.sentences(),
    TopicArn: topic,
  };
  main(payload);
}, 5000);
