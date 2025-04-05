import AWS from "aws-sdk";

import { Creates3Client } from "./userClient/s3client.js";

const assumeRole = async (req, res) => {

    const { roleArn, bucketName } = req.body;

    if (!roleArn) {
        return res.status(404).json({ message: "Please provide roleArn" });
    }

    const sts = new AWS.STS();

    try {
        const response = await sts.assumeRole({
            RoleArn: roleArn,
            RoleSessionName: "UserSession",  // Unique session name
            DurationSeconds: 3600  // 1-hour temporary credentials
        }).promise();

        const accessKeyId = response.Credentials.AccessKeyId
        const secretAccessKey = response.Credentials.SecretAccessKey
        const sessionToken = response.Credentials.SessionToken

        const s3Client = Creates3Client(req,res,accessKeyId, secretAccessKey, sessionToken, bucketName);

        res.status(200).json({ message: "successfully created role" });

    } catch (error) {
        console.error("Error assuming role:", error);
        throw new Error("Failed to assume role");
    }
};

export default assumeRole;