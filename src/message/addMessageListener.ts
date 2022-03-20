import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { LambdaResponse } from '../types/types';

const AWS = require('aws-sdk')
const { uuid } = require('uuidv4');
AWS.config.update({ region: 'ap-southeast-2' })

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.MESSAGE_TABLE

interface MessageItem {
  message_id: String
  board_id: String
  message: String
}


export const handler = async (event: SNSEvent): Promise<LambdaResponse> => {
  const record: SNSEventRecord = event.Records[0];

  const message = JSON.parse(record.Sns.Message)
  console.log(message)

  const item: MessageItem = {
    message_id: uuid(),
    board_id: message.board_id,
    message: message.message,
  }

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