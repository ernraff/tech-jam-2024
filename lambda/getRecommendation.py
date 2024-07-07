import json
import boto3
import os
import time
import sys

state_machine_arn = 'arn:aws:states:us-east-1:604242335225:stateMachine:MyStateMachine-xnsut9h02'
test_arn = "arn:aws:states:us-east-1:604242335225:execution:MyStateMachine-xnsut9h02:80995c77-7971-4184-ad4a-578962e00f08"

### This lambda handler that takes execution id and return tiktok trending sounds . 
def lambda_handler(event, context):

    execution_arn = event['pathParameters']['jobId']

    # Initialize the Step Functions client
    step_function_client = boto3.client('stepfunctions')
    
    # Describe the Step Function execution to get its details
    response = step_function_client.describe_execution(
        executionArn=execution_arn
    )

    if(response['status'] == "SUCCEEDED"):
        # Extract and print the execution status
        execution_output = response["output"]
        print(f"Execution ID '{execution_arn}' execution_output: {execution_output}")
        # Parse the output into a dictionary
        execution_output_dict = json.loads(execution_output)
        execution_output_dict['status'] = response['status']
        return {
        'statusCode' : 200,
        'body' : json.dumps(execution_output_dict)
        }

    return {
        'statusCode' : 200,
        'body' : json.dumps(response['status'])
    }
