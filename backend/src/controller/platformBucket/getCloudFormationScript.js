import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../../lib/platformClient/s3.js";

export const getCloudFormationScript = async (req, res) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    const fileName = "cloudformation-template.yaml"; 
    const expiration = 30 * 60; 

    if (!bucketName) {
      return res.status(400).json({ message: "Bucket name is not configured." });
    }

    const s3Client = await getS3Client(); 

    if (!s3Client) {
      return res.status(400).json({ message: "S3 client not initialized" });
    }

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      }),
      { expiresIn: expiration }
    );

    if (!signedUrl) {
      return res.status(400).json({ message: "Failed to generate signed URL." });
    }

    res.status(200).json({ message: "Success", url: signedUrl });
  } catch (error) {
    console.error("Error generating CloudFormation script URL:", error);
    res.status(500).json({ message: "Internal server error in getCloudFormationScript" });
  }
};
