import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-west-2",
  credentials: {
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  }
});

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed"})
  }

  try {
    let { name } =  JSON.parse(req.body)

    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: name,
      Body: req,
    }
    const command = new PutObjectCommand(fileParams);
    const signedURL = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    })
    res.status(200).json({ signedURL })

  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Error uploading the image" })
  }
}