import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TechJam2024Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //define REST API
    const api = new apigateway.RestApi(this, "RestAPI", {
      restApiName: "TechJamAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
    });

    //add usage plan to API
    const plan = api.addUsagePlan("UsagePlan", {
      name: "UsagePlan",
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    plan.addApiStage({
      stage: api.deploymentStage,
    });

    //generate api key
    const apiKey = api.addApiKey("ApiKey");
    plan.addApiKey(apiKey);

    //create execution role for our lambda function
    const lambdaExecutionRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
      ],
    });

    // create lambda function
    const lambdaFunction = new lambda.Function(this, "LambdaFunction", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "lambda.lambda_handler", //define lambda handler function
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lambda") //path to lambda directory)
      ),
      timeout: cdk.Duration.minutes(3),
      role: lambdaExecutionRole,
    });

    //create s3 bucket for video storage
    const bucket = new s3.Bucket(this, "VideoBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    //create an IAM role for apigateway to allow access to s3 bucket
    const apiGatewayS3Role = new iam.Role(this, "ApiGatewayS3Role", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    bucket.grantPut(apiGatewayS3Role);

    //GET method with Lambda proxy integration
    const getIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
      proxy: true,
    });

    api.root.addMethod("GET", getIntegration, {
      apiKeyRequired: true,
    });

    //PUT method with S3 integration
    const putIntegration = new apigateway.AwsIntegration({
      service: "s3",
      integrationHttpMethod: "PUT",
      path: "${bucket.bucketName}/{object}",
      options: {
        credentialsRole: apiGatewayS3Role,
        requestParameters: {
          "integration.request.path.object": "method.request.path.object",
          "integration.request.header.Content-Type":
            "method.request.header.Content-Type",
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type":
                "integration.response.header.Content-Type",
            },
          },
        ],
      },
    });

    const putMethodOptions: apigateway.MethodOptions = {
      requestParameters: {
        "method.request.path.object": true,
        "method.request.header.Content-Type": true,
      },
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Content-Type": true,
          },
        },
      ],
    };

    api.root
      .addResource("{object}")
      .addMethod("PUT", putIntegration, putMethodOptions);
  }
}
