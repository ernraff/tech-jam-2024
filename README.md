# TikTok Tech Jam 2024 #

## Main Architecture ##

![techjam](https://github.com/ernraff/tech-jam-2024/assets/103540977/f7824a27-3c7d-48bc-9301-7b7a2eed4ce1)

All the APIs that are created:
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket  
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName} // Get Recommendation based on file(video here) 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} // Get the job output if the job is successful, Otherwise it returns the job status.

## User Flow ## 
- The user who has apikey for the authentication uploads video to the website.
  - This will invoke, the API that return presigned URL to upload file to s3 bucket.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket  
  - Once the UI receives the presigned URL, it uploads the file directly.
  - Once the file is uploaded successfully to the server from UI, the UI invokes the async api that starts the recommendation job.
    - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName}
  - The UI periodically request to the API that checks status of the job.
    - Once the job is successful, the API returns the trending tiktok song titles.
    - If the job is still running, the UI waits.
       - https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} 

### Recommendation API Architecture ###
- In order to overcome API gateway timeout and to make a better user experience, we decided to do this in async. 

#### Async Step function to invoke video labeling and querying gemini AI ####
![image](https://github.com/ernraff/tech-jam-2024/assets/103540977/aa41b2f7-badb-4b77-8089-1fef1822cb97)

#### Video Labeling system design ####
![RecommendationLambdaRekognitionDesign](https://github.com/ernraff/tech-jam-2024/assets/103540977/0909dc36-950e-4093-9e15-2e5f5ab5e97d)



