import json
import boto3
import os

## presigned URL handler 
def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    bucket_name = 'techjam2024stack-videobucket6ed8e1af-hcgnxazm6xvn'
    key = event['pathParameters']['fileName']
    presigned_url = ""
    try:
        presigned_url = s3_client.generate_presigned_url(
        'put_object',
        Params={'Bucket': bucket_name, 'Key': key},
        ExpiresIn=3600
    )
    except e:
        print("something went wrong during assigning url process")
        raise e

    print("presigned_url:"+presigned_url)
    return {
        'statusCode': 200,
        'body': json.dumps({'url': presigned_url})
    }
