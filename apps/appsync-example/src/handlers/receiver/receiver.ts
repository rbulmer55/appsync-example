import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('AppSync Event details:', event);

        const { body = {} } = event;

        console.log('Lambda Invoked with the following Parameters', body);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'AppSync Lambda request initiated',
                body,
            }),
        };
    } catch (error: any) {
        console.log(`An Error Occurred. ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An Error Occurred. ${error.message}`,
                error,
            }),
        };
    }
}
