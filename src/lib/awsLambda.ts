// src/lib/awsLambda.ts
import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda"

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
})

export async function updateLambda(data: any) {
  // data может содержать, например, название Lambda, S3Bucket, S3Key
  const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || ""
  
  const command = new UpdateFunctionCodeCommand({
    FunctionName: functionName,
    // Пример: код берётся из s3
    S3Bucket: data.s3Bucket || "my-chatbot-bucket",
    S3Key: data.s3Key || "chatbot_code.zip"
    // Если нужно, можно указать S3ObjectVersion и т.д.
  })
  
  const response = await lambdaClient.send(command)
  return response
}
