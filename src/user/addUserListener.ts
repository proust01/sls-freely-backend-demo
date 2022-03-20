import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { LambdaResponse } from '../types/types';

import aws from 'aws-sdk'
import { uuid } from 'uuidv4';
aws.config.update({ region: 'ap-southeast-2' })

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_TABLE

interface UserItem {
  user_id: String
  name: String
  email: String
}


export const handler = async (event: SNSEvent): Promise<LambdaResponse> => {
  const record: SNSEventRecord = event.Records[0];

  const message = JSON.parse(record.Sns.Message)
  console.log(message)

  const item: UserItem = {
    user_id: uuid(),
    name: message.name,
    email: message.email
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