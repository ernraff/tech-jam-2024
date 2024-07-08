# TikTok Tech Jam 2024 #

## Problem Statement ##

Relevant problem domain: Music Discovery

When creating content to post to TikTok, users may not have a particular sound in mind.  Our application returns audio suggestions to the user based on the content of their video.

## Architecture ##

![image](https://github.com/ernraff/tech-jam-2024/assets/103540977/e08c8452-dd45-462b-b212-fbf3eb81b1b8)

All the APIs that are created:
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket  
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName} // Get Recommendation based on file(video here) 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} // Get the job output if the job is successful, Otherwise it returns the job status.

## User Flow ## 
- User who has api key for the authentication uploads video to the website.
  - This will invoke the API that returns presigned URL to upload file to s3 bucket.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket  
  - Once the UI receives the presigned URL, it uploads the file directly.
  - Once the file is uploaded successfully to the server from UI, the UI invokes the async api that starts the recommendation job.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName}
  - The UI periodically request to the API that checks status of the job.
    - Once the job is successful, the API returns the trending tiktok song titles.
    - If the job is still running, the UI waits.
       - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} 

## Asset ##
- Backend 
  - AWS Services
    - S3, Lambda, Step Function, Rekognition, SQS, SNS, API Gateway, SageMaker(Jupyter Notebook), and CDK.
- Frontend
  - Django
  - Google Gemini SDK
  - Tiktok Content posting API
 

### Recommendation API Architecture ###
- In order to overcome API gateway timeout and to make a better user experience, we decided to do this in async. 




