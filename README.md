# TikTok Tech Jam 2024 #

## Main Architecture ##

![techjam](https://github.com/ernraff/tech-jam-2024/assets/103540977/f7824a27-3c7d-48bc-9301-7b7a2eed4ce1)

### Recommendation API Architecture ###

#### Video Labeling system design ####
![RecommendationLambdaRekognitionDesign](https://github.com/ernraff/tech-jam-2024/assets/103540977/0909dc36-950e-4093-9e15-2e5f5ab5e97d)

 Use Case(Based on the user that has apikey for the authentication) 



 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName} // Get Recommendation based on file(video here) 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} // Get the job output if the job is successful, Otherwise it returns the job status. 
