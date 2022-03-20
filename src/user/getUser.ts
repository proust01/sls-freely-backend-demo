// GET /user

import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
import aws from 'aws-sdk'
import _ from 'underscore';

aws.config.update({ region: 'ap-southeast-2' })

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_TABLE

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {

    let user_id = event.headers.app_user_id;

    try {

        let params = {
            TableName: tableName,
            KeyConditionExpression: "user_id = :user_id",
            ExpressionAttributeValues : {
                ":user_id" : user_id
            },
            Limit: 1,
        }
    
        let data = await dynamodb.query(params).promise();
    
        // validation for empty data
        if(!_.isEmpty(data.Items)) {
            
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
              body: JSON.stringify(data),
            };
        } else {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                  },
                body: "No data found"
            }
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