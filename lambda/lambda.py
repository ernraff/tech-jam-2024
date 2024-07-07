import json
import boto3
import os

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    bucket_name = 'techjam2024stack-videobucket6ed8e1af-hcgnxazm6xvn'
    key = event['pathParameters']['fileName']
    return {
        'statusCode' : 200,
        'body' : json.dumps({'fileName': key})
    }
