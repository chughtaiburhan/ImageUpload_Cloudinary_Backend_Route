import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (imageBuffer, originalFileName) => {
  const hasCloudinaryConfig =
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_SECRET_KEY;

  if (!hasCloudinaryConfig) {
    const timestamp = Date.now();
    const fileName = originalFileName ? originalFileName.replace(/\.[^/.]+$/, "") : "unknown";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fileName
    )}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true&t=${timestamp}`;
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "doctors",
            resource_type: "auto",
            transformation: [
              { width: 300, height: 300, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(imageBuffer);
    });

    return result.secure_url;
  } catch (error) {
    const timestamp = Date.now();
    const fileName = originalFileName ? originalFileName.replace(/\.[^/.]+$/, "") : "error";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fileName
    )}&background=FF5F6F&color=fff&size=300&rounded=true&bold=true&t=${timestamp}`;
  }
};

export const getDefaultDoctorImage = () => {
  return "https://ui-avatars.com/api/?name=Doctor&background=5f6FFF&color=fff&size=300&rounded=true&bold=true";
};

export const getFallbackDoctorImage = (doctorName) => {
  const name = doctorName || "Doctor";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
};
