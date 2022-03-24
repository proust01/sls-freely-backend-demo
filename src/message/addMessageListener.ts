import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
import { config, DynamoDB } from 'aws-sdk';
import { uuid } from 'uuidv4';

config.update({ region: 'ap-southeast-2' })

const dynamodb = new DynamoDB.DocumentClient();
const tableName = process.env.MESSAGE_TABLE

// Type for DynamoDB item
interface MessageItem {
  message_id: String
  board_id: String
  message: String
}


export const handler = async (event: SNSEvent): Promise<LambdaResponse> => {

  // Getting SNS Event
  const record: SNSEventRecord = event.Records[0];
  const message = JSON.parse(record.Sns.Message)
  console.log(message)

  // Create DynamoDB item
  const item: MessageItem = {
    message_id: uuid(),
    board_id: message.board_id,
    message: message.message,
  }

  // Store Data
  try {
    let data = await dynamodb.put({
      TableName: tableName,
      Item: item
    }).promise()

    return {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(data),
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