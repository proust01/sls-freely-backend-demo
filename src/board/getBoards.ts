// GET /boards

import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/types';
import { config, DynamoDB } from 'aws-sdk';
import _ from 'underscore';

config.update({ region: 'ap-southeast-2' })

const dynamodb = new DynamoDB.DocumentClient();
const tableName = process.env.BOARD_TABLE

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {

    // Getting user id from header
    let user_id = event.headers.app_user_id;

    
    // Create DynamoDB params
    let params = {
        TableName: tableName,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues : {
            ":user_id" : user_id
        },
    }

    // Query data
    try {

        let data = await dynamodb.query(params).promise();
    
        // error handling for empty data
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