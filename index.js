var aws = require('aws-sdk')
const StateMachineArn = process.env.StateMachineArn;
var inputjson = {};

exports.handler = (event, context, callback) => {

  for (const { messageId, body } of event.Records) {
        console.log('SQS message %s: %j', messageId, body);
        const obj = JSON.parse(body);
        inputjson.CreditorAssigned_ID = obj.CreditorAssigned_ID;
        inputjson.External_ID = obj.External_ID;
    }
  
  inputjson.LoanApplication_Status = 5;
  inputjson.LoanApplication_BankerComment = "Approved";
  
  var params = {
    stateMachineArn: StateMachineArn,
    input: JSON.stringify(inputjson)
  };
  
  var stepfunctions = new aws.StepFunctions()
  stepfunctions.startExecution(params, (err, data) => {
    if (err) {
    console.log(err);
    const response = {
        statusCode: 500,
        body: JSON.stringify({
        message: 'There was an error'
        })
    };
    callback(null, response);
    } else {
    console.log(data);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
        message: 'Step function worked'
        })
    };
    callback(null, response);
    }
});
} 