import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const uploadMiddleware = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const publicId = `${file.fieldname}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      return {
        folder: folderName,
        public_id: publicId,
        resource_type: 'auto',
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

export default uploadMiddleware;
