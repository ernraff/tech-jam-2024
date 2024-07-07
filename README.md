# TikTok Tech Jam 2024 #

## Main Architecture ##

![techjam](https://github.com/ernraff/tech-jam-2024/assets/103540977/f7824a27-3c7d-48bc-9301-7b7a2eed4ce1)

### Recommendation API Architecture ###

#### Async Step function to invoke video labeling and querying gemini AI ####
![image](https://github.com/ernraff/tech-jam-2024/assets/103540977/aa41b2f7-badb-4b77-8089-1fef1822cb97)

#### Video Labeling system design ####
![RecommendationLambdaRekognitionDesign](https://github.com/ernraff/tech-jam-2024/assets/103540977/0909dc36-950e-4093-9e15-2e5f5ab5e97d)

 Use Case(Based on the user that has apikey for the authentication) 



 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/presignedUrl/{fileName}   // Get presigned URL to upload the file to S3 bucket 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/recommendation/{fileName} // Get Recommendation based on file(video here) 
- https://lg1uksflod.execute-api.us-east-1.amazonaws.com/prod/TechJam/status/{jobId} // Get the job output if the job is successful, Otherwise it returns the job status. 
