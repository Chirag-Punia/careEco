import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(
  files,
  businessName,
  defaultContentType = "text/html"
) {
  const bucketName = process.env.AWS_S3_BUCKET;
  const prefix = businessName.toLowerCase().replace(/\s+/g, "-");

  try {
    const uploadedUrls = {};

    for (const [filename, content] of Object.entries(files)) {
      const contentType = filename.endsWith(".html")
        ? "text/html"
        : filename.endsWith(".css")
        ? "text/css"
        : filename.endsWith(".jpg") || filename.endsWith(".jpeg")
        ? "image/jpeg"
        : filename.endsWith(".png")
        ? "image/png"
        : "application/javascript";

      const params = {
        Bucket: bucketName,
        Key: `${prefix}/${filename}`,
        Body: content,
        ContentType: contentType,
        ACL: "public-read",
      };

      const result = await s3.upload(params).promise();
      uploadedUrls[filename] = result.Location;
    }

    if (Object.keys(files).some((key) => key.endsWith(".html"))) {
      await s3
        .putBucketWebsite({
          Bucket: bucketName,
          WebsiteConfiguration: {
            IndexDocument: { Suffix: "index.html" },
            ErrorDocument: { Key: "error.html" },
          },
        })
        .promise();

      const bucketPolicy = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      };

      await s3
        .putBucketPolicy({
          Bucket: bucketName,
          Policy: JSON.stringify(bucketPolicy),
        })
        .promise();
    }
    return uploadedUrls;
  } catch (error) {
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
}
export async function deleteFilesFromS3(fileKeys) {
  const bucketName = process.env.AWS_S3_BUCKET;

  if (!Array.isArray(fileKeys)) {
    fileKeys = [fileKeys];
  }

  const objectsToDelete = fileKeys.map((key) => ({
    Key: key,
  }));

  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: objectsToDelete,
      Quiet: false,
    },
  };

  try {
    const response = await s3.deleteObjects(params).promise();

    if (response.Errors && response.Errors.length > 0) {
      throw new Error(
        `Failed to delete files: ${response.Errors.map((e) => e.Key).join(
          ", "
        )}`
      );
    }

    console.log(`Successfully deleted files: ${fileKeys.join(", ")}`);
    return response;
  } catch (error) {
    console.error(`Error deleting files from S3: ${error.message}`);
    throw new Error(`Failed to delete files from S3: ${error.message}`);
  }
}
