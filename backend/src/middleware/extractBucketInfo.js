import User from "../models/user.Model.js"; 

const extractBucketInfo = async (req, res, next) => {
    try {
        const userId = await User.findById(req.user._id);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const user = await User.findById(userId).select("ConnectedBucket");

        if (!user || !user.ConnectedBucket) {
            return res.status(404).json({ error: "Connected bucket not found" });
        }

        const { bucketName, accessKeyId, secretAccessKey } = user.ConnectedBucket;

        if (!bucketName || !accessKeyId || !secretAccessKey) {
            return res.status(400).json({ error: "Incomplete bucket credentials" });
        }

        req.bucketInfo = { bucketName, accessKeyId, secretAccessKey };

        next();
    } catch (error) {
        console.error("Error extracting bucket info:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default extractBucketInfo;
