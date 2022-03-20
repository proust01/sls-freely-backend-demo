import { SQSEvent, SQSRecord } from 'aws-lambda';
import { LambdaResponse } from '../types/types';

import aws from 'aws-sdk'
import { uuid } from 'uuidv4';
aws.config.update({ region: 'ap-southeast-2' })

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.BOARD_TABLE

interface BoardItem {
  board_id: String
  user_id: String
  board_name: String
}

export const handler = async (event: SQSEvent): Promise<LambdaResponse> => {
  const record: SQSRecord = event.Records[0];

  const message = JSON.parse(record.body)
  console.log(message)

  const item: BoardItem = {
    board_id: uuid(),
    user_id: message.user_id,
    board_name: message.board_name,
  }
  console.log(item)

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