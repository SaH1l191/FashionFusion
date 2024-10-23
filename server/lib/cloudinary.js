import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadImageToCloudinary= async (file, folder, height, quality) => {

  if (!file || !file.tempFilePath) {
    throw new Error("No file provided for upload.");
  }

  const options = {
    folder,
    resource_type: "auto",
  };

  if (height) {
    options.height = height;
    options.crop = "limit";
  }

  if (quality) {
    options.quality = quality;
  }

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
};

