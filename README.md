# TikTok Tech Jam 2024 #

## Team Members ##
- Erin Rafferty
- Sitanshu Kushwaha

## Problem Statement ##

Relevant problem domain: Music Discovery

When creating content to post to TikTok, users may not have a particular sound in mind.  Our application returns audio suggestions to the user based on the content of their video.

## Architecture ##

![image](https://github.com/ernraff/tech-jam-2024/assets/103540977/e08c8452-dd45-462b-b212-fbf3eb81b1b8)

The APIs we created:
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket  
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName} // Get Recommendation based on file(video here) 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} // Get the job output if the job is successful, Otherwise it returns the job status.

## User Flow ## 
- User uploads video to the website using API key for the authentication .
  - This will invoke the API that returns a presigned URL that will allow the client to upload directly to the S3 bucket.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName} 
  - Once the client receives the presigned URL, it uploads the file directly.
  - Once the file is uploaded successfully to the server, the UI invokes the async API that starts the recommendation job.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName}
  - The UI makes periodic requests to the API that checks status of the job.
    - Once the job is successful, the API returns the trending TikTok song titles.
    - If the job is still running, the UI waits.
       - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} 

## Assets ##
- Backend 
  - AWS Services
    - S3, Lambda, Step Function, Rekognition, SQS, SNS, API Gateway, SageMaker(Jupyter Notebook), and CDK.
- Frontend
  - Django
  - Google Gemini SDK
  - Tiktok Content Posting API 

## Setback ##
- In order to overcome API gateway timeout and to make a better user experience, we decided to do this in async.
- We were unable to register our app on the TikTok developer website in time for submission.  For demonstration purposes, our UI uses a dummy API in place of the Content Posting API.




