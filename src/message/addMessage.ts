import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
const aws = require('aws-sdk')
aws.config.update({ region: 'ap-southeast-2' })
const sns = new aws.SNS({ region: 'ap-southeast-2' })

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

    console.log("region : ", process.env.region)
    console.log("accountId : ", process.env.accountId)
    const params = {
        Message: JSON.stringify(data),
        TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:sns-message-event`
      }
    

    try {
    const metadata = await sns.publish(params).promise()
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