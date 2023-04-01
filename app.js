const express = require("express");
require("dotenv").config();
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
console.log("🚀 ~ file: app.js:8 ~ s3:", s3);

const app = express();
app.use(express.json());

const BUCKET_NAME = process.env.BUCKET_NAME;
console.log("🚀 ~ file: app.js:13 ~ BUCKET_NAME:", BUCKET_NAME);

app.get("/health", (req, res) => {
  res.send("OK");
});

// Get all objects in S3 bucket
app.get("/objects", async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
  };
  try {
    const data = await s3.listObjects(params).promise();
    res.json(data.Contents);
  } catch (err) {
    console.error(`Error listing objects in ${BUCKET_NAME}: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific object in S3 bucket
app.get("/objects/:key", async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: req.params.key,
  };
  try {
    const data = await s3.getObject(params).promise();
    res.send(data.Body.toString());
  } catch (err) {
    console.error(
      `Error getting object ${req.params.key} from ${BUCKET_NAME}: ${err}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload a file to S3 bucket
app.post("/objects", async (req, res) => {
  const { key, content } = req.body;
  if (!key || !content) {
    res.status(400).json({ error: "Missing key or content" });
    return;
  }
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: content,
  };
  try {
    await s3.upload(params).promise();
    res.send(`File ${key} uploaded successfully to ${BUCKET_NAME}`);
  } catch (err) {
    console.error(`Error uploading file ${key} to ${BUCKET_NAME}: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a file from S3 bucket
app.delete("/objects/:key", async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: req.params.key,
  };
  try {
    await s3.deleteObject(params).promise();
    res.send(`File ${req.params.key} deleted successfully from ${BUCKET_NAME}`);
  } catch (err) {
    console.error(
      `Error deleting file ${req.params.key} from ${BUCKET_NAME}: ${err}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
