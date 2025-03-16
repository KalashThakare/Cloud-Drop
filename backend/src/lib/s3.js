import { S3Client } from "@aws-sdk/client-s3";

let s3Instances = {};

export const createS3Client = ({ Key, accessKey, bucket_Region }) => {
    const instanceKey = `${Key}-${bucket_Region}`; 

    if (!s3Instances[instanceKey]) {
        s3Instances[instanceKey] = new S3Client({
            region: bucket_Region,
            credentials: {
                accessKeyId: Key,
                secretAccessKey: accessKey
            }
        });
    }

    return s3Instances[instanceKey];
};
