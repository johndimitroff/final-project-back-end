const express = require("express");

const { imageUploader, videoUploader } = require("../config/file-uploader.js");

const router = express.Router();

//single for one file, use a different .x for other options
router.post(
  "/upload-image",
  imageUploader.single("imageFile"),
  (req, res, next) => {
    //multer puts all the info about the uploaded file in "req.file"
    console.log("NEW FILE UPLOAD", req.file);

    if (!req.file) {
      next(new Error("No image uploaded!"));
    } else {
      const { originalName, secure_url, format, width, height } = req.file;
      res.json({
        imageName: originalName,
        imageUrl: secure_url,
        format,
        width,
        height
      });
    }
  }
);

router.post(
  "/upload-video",
  videoUploader.single("videoFile"),
  (req, res, next) => {
    //multer puts all the info about the uploaded file in "req.file"
    console.log("NEW FILE UPLOAD", req.file);

    if (!req.file) {
      next(new Error("No image uploaded!"));
    } else {
      const { originalName, secure_url, format, width, height } = req.file;
      res.json({
        videoName: originalName,
        videoUrl: secure_url,
        format,
        width,
        height
      });
    }
  }
);

module.exports = router;
