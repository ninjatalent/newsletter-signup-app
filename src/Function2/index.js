const qs = require('qs'); // query string interpreter
const AWS = require('aws-sdk'); // we didn't have to add this like qs this since it's standard on all functions
exports.handler = async message => {
  console.log(message);
  const formData = qs.parse(message.body); // the 'message' is everything we got from the api endpoint. QS makes it easy to parse out the form data from the body
  console.log(formData); // you can delete this in production

  const dynamodb = new AWS.DynamoDB(); // because of our permissions setup, we don't have to specify *which* DB
  const params = {
    Item: {
      'email': {
        S: formData.email // S: indicates to DynamoDB this will be a string
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: process.env.TABLE_NAME // uses the env variable that Stackery defined
  };
  await dynamodb.putItem(params).promise(); // save to the DB (with a node 8-style await)

  // we need to return a response or the browser will show an error
  return {
    statusCode: 302,
    headers: {'Location': 'https://stackery.io'}
  };
};