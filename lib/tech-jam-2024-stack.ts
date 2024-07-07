import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as logs from "aws-cdk-lib/aws-logs";
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
    const getSoundsLambda = new lambda.Function(this, "LambdaFunction", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "lambda.lambda_handler", //define lambda handler function
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lambda") //path to lambda directory)
      ),
      timeout: cdk.Duration.minutes(3),
      role: lambdaExecutionRole,
    });

    //create s3 bucket for video storage
    const accessLogsBucket = new s3.Bucket(this, "AccessLogsBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const fileBucket = new s3.Bucket(this, "VideoBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "logs",
    });

    const presignedUrlRole = new iam.Role(this, "PresignedUrlRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        AllowS3BucketObjectAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["s3:GetObject"],
              resources: [fileBucket.bucketArn + "/*"],
            }),
          ],
        }),
      },
    });

    const presignedUrlLambda = new lambda.Function(this, "PresignedUrlLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "presignedurl.lambda_handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        PRESIGN_URL_ROLE_ARN: presignedUrlRole.roleArn,
        BUCKET_ARN: fileBucket.bucketArn,
        BUCKET_NAME: fileBucket.bucketName,
      },
    });

    presignedUrlRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        effect: iam.Effect.ALLOW,
        principals: [
          iam.Role.fromRoleArn(
            this,
            "PresignedUrlRoleFromRoleArn",
            presignedUrlLambda.role?.roleArn!
          ),
        ],
      })
    );

    new logs.LogGroup(this, "PresignedUrlLambdaLogGroup", {
      logGroupName: "/aws/lambda/" + presignedUrlLambda.functionName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const techJamApiGw = api.root.addResource("TechJam");

    const presignedUrlApiGw = techJamApiGw.addResource("presignedUrl");
    const presignedUrlIntegration = new apigateway.LambdaIntegration(
      presignedUrlLambda
    );
    presignedUrlApiGw
      .addResource("{fileName}")
      .addMethod("GET", presignedUrlIntegration, { apiKeyRequired: true });

    const recommendationApiGw = techJamApiGw.addResource("recommendation");
    const recommendationIntegration = new apigateway.LambdaIntegration(
      getSoundsLambda,
      {
        proxy: true,
      }
    );
    recommendationApiGw
      .addResource("{fileName}")
      .addMethod("GET", recommendationIntegration, { apiKeyRequired: true });
  }
}
