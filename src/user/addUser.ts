import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
// import aws from 'aws-sdk'
import { config,  SNS } from 'aws-sdk';
// const aws = require('aws-sdk')

config.update({ region: 'ap-southeast-2' })
// aws.config.update({ region: 'ap-southeast-2' })
const sns = new SNS({ region: 'ap-southeast-2' })
// const sns = new aws.SNS({ region: 'ap-southeast-2' })

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

    // Create params for SNS event
    const params = {
        Message: JSON.stringify(data),
        TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:sns-user-event`
      }
    
    // Send SNS message
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