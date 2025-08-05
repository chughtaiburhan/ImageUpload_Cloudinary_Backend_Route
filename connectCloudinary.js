// connectCloudinary.js
import { v2 as cloudinary } from "cloudinary";

/**
 * Configures Cloudinary using environment variables.
 * This function should be called once at application startup.
 */
const connectCloudinary = () => {
  // Check if Cloudinary is already configured to prevent re-configuration warnings
  if (cloudinary.config().cloud_name === process.env.CLOUDINARY_NAME &&
      cloudinary.config().api_key === process.env.CLOUDINARY_API_KEY &&
      cloudinary.config().api_secret === process.env.CLOUDINARY_SECRET_KEY) {
    console.log("Cloudinary already configured.");
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // Note: Your .env uses CLOUDINARY_SECRET_KEY, not CLOUDINARY_API_SECRET
  });

  console.log("Cloudinary configuration attempted.");
  // Optional: Log config values for debugging (masking sensitive info)
  console.log("  Cloud Name:", process.env.CLOUDINARY_NAME);
  console.log("  API Key:", process.env.CLOUDINARY_API_KEY ? "********" : "NOT SET");
  console.log("  API Secret:", process.env.CLOUDINARY_SECRET_KEY ? "********" : "NOT SET");
};

export default connectCloudinary;
