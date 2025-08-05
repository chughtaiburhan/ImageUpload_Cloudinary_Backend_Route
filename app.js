import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

import uploadMiddleware from "./uploadMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const upload = uploadMiddleware("doctors_uploads");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/profile-upload-single', upload.single('profile-file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Error</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; }
          a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          a:hover { background-color: #c82333; }
        </style>
      </head>
      <body>
        <h2>Upload Failed!</h2>
        <p>No file was uploaded. Please select a file and try again.</p>
        <a href="/">Go Back</a>
      </body>
      </html>
    `);
  }

  try {
    const imageUrl = req.file.path;

    console.log(`Image uploaded successfully to Cloudinary: ${imageUrl}`);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Success!</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; }
          img { max-width: 80%; height: auto; border: 1px solid #28a745; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; }
          a:hover { background-color: #218838; }
        </style>
      </head>
      <body>
        <h2>Upload Success!</h2>
        <p>Your image has been uploaded to Cloudinary.</p>
        <img src="${imageUrl}" alt="Uploaded Image" />
        <br/>
        <p>Cloudinary URL: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
        <a href="/">Upload Another Image</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error during image upload process:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Error</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; }
          a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          a:hover { background-color: #c82333; }
        </style>
      </head>
      <body>
        <h2>Upload Failed!</h2>
        <p>An error occurred during the upload process. Please try again.</p>
        <p>Details: ${error.message || 'Unknown error'}</p>
        <a href="/">Go Back</a>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
