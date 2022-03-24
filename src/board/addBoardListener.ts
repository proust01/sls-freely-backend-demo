import { SQSEvent, SQSRecord } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
import { config, DynamoDB } from 'aws-sdk';
import { uuid } from 'uuidv4';

config.update({ region: 'ap-southeast-2' })

const dynamodb = new DynamoDB.DocumentClient();
const tableName = process.env.BOARD_TABLE

// Type for DynamoDB item
interface BoardItem {
  board_id: String
  user_id: String
  board_name: String
}

export const handler = async (event: SQSEvent): Promise<LambdaResponse> => {

  // Getting SQS message
  const record: SQSRecord = event.Records[0];
  const message = JSON.parse(record.body)
  console.log(message)

  // Create DynamoDB item
  const item: BoardItem = {
    board_id: uuid(),
    user_id: message.user_id,
    board_name: message.board_name,
  }
  console.log(item)

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