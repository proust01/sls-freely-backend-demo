import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
const aws = require('aws-sdk')
// aws.config.update({ region: 'ap-southeast-2' })
const sqs = new aws.SQS();

interface MessageBodyInput {
  user_id: String
  board_name: String
}

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {

    if (!event.body) {
        return {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            statusCode: 400,
            body: "invalid message",
          }
      }

    const data = JSON.parse(event.body)
    let user_id = event.headers.app_user_id;

    const messageBody: MessageBodyInput = {
      user_id: user_id,
      board_name: data.board_name
    }

    
    const params = {
        
        QueueUrl: `https://sqs.${process.env.region}.amazonaws.com/${process.env.accountId}/BoardQueue-dev`,
        MessageBody: JSON.stringify(messageBody),
      }
    

    try {
    const metadata = await sqs.sendMessage(params).promise()
    return {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(metadata),
      }
    } catch (err) {
        return {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            statusCode: 500,
            body: JSON.stringify(err.message),
          }
    }
};