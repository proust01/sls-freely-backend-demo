import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
import { SQS } from 'aws-sdk';

const sqs = new SQS();

// Create Type for SQS message
interface MessageBodyInput {
  user_id: String
  board_name: String
}

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {

    // error handling for null event body value
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

    // Gettig a user info from header
    let user_id = event.headers.app_user_id;

    // create SQS message for Board
    const messageBody: MessageBodyInput = {
      user_id: user_id,
      board_name: data.board_name
    }

    // create params for SQS message
    const params = {
        
        QueueUrl: `https://sqs.${process.env.region}.amazonaws.com/${process.env.accountId}/BoardQueue-dev`,
        MessageBody: JSON.stringify(messageBody),
      }
    

    // Send SQS message
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