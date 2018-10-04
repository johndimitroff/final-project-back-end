const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

//cloudinary is the npm package to use the Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//multer is the one that integrates with your Express routes directly
const imageUploader = multer({
  storage: cloudinaryStorage({
    cloudinary,
    folder: "app-images"
  })
});

const videoUploader = multer({
  storage: cloudinaryStorage({
    cloudinary,
    folder: "app-video",
    params: {
      resource_type: "video"
    }
  })
});

module.exports = { imageUploader, videoUploader };
