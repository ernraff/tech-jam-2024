import json
import boto3
import os
import time
import sys

state_machine_arn = 'arn:aws:states:us-east-1:604242335225:stateMachine:MyStateMachine-xnsut9h02'

### This lambda handler sends an async request to create labels for the video file and return the job execution id.
def lambda_handler(event, context):
    region_name = 'us-east-1'
    s3_client = boto3.client('s3')
    bucket_name = 'techjam2024stack-videobucket6ed8e1af-xlqpbzfoirbp'
    video = event['pathParameters']['fileName']
    input_data = {
        "fileName": video
    }
    
    # Initialize the Step Functions client
    step_function_client = boto3.client('stepfunctions')
    
    execution_arn = None
    
    try:
        # Start the Step Function execution
        response = step_function_client.start_execution(
            stateMachineArn=state_machine_arn,
            input=json.dumps(input_data)
        )
    
        # Extract the execution ARN from the response
        execution_arn = response['executionArn']
        print(f"Started execution with ARN: {execution_arn}")
        # Optionally return execution ARN or other response details

    except Exception as e:
        print(f"Error starting Step Function execution: {e}")
        
    return {
        'statusCode' : 200,
        'body' : json.dumps(execution_arn)
    }
