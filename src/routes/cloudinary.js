const express = require("express");
const router = express.Router();
const uniqid = require("uniqid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

//! ROUTE AVEC TEMP
router.post("/upload-image", async (req, res) => {
  // console.log(req.files);
  const image_file = req.files.photoNewPoi;
  const temp_image = `/src/temp/${uniqid()}.jpg`;
  // console.log("TEMP Image :", temp_image);
  const move_result = await image_file.mv(temp_image);

  // console.log("moveResult", move_result);

  if (move_result === undefined) {
    const upload_res = await cloudinary.uploader.upload(temp_image, {
      resource_type: "image",
      public_id: `DLH/poi-${uniqid()}`,
      overwrite: false, //! overwrites the existing picture at specified public_id
    });

    if (upload_res) {
      fs.unlinkSync(temp_image);
      return res.status(201).json({
        success: true,
        response: upload_res,
        cdn_url: upload_res.secure_url,
      });
    }
  }

  return res.status(500).json({
    success: false,
    response: "route default response",
    message: "shit happened outside of the try/catch block",
  });
});

//! ROUTE DU COURS LA CAPSULE
router.post('/upload', async (req, res) => {
  const photoPath = `/tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoNewPoi.mv(photoPath);
 
  if (!resultMove) {
     const resultCloudinary = await cloudinary.uploader.upload(photoPath);
     fs.unlinkSync(photoPath); 
    return res.json({ result: true, url: resultCloudinary.secure_url});      
  } else {
    return res.json({ result: false, error: resultMove });
  }
 });

// //! ROUTE DIRECTE
// router.post("/upload-image-directly", async (req, res) => {
// try {
//   const image_file = req.files.photoNewPoi;

//   // Ensure that a file is uploaded
//   if (!image_file) {
//     return res.status(400).json({
//       success: false,
//       message: "No file uploaded",
//     });
//   }

//   const upload_res = await cloudinary.uploader.upload(image_file.data, {
//     resource_type: "auto", // Automatically detect the resource type
//     public_id: `DLH/poi-${uniqid()}`,
//     overwrite: false,
//     file: { content: image_file.data }
//   });

//   if (upload_res) {
//     return res.status(201).json({
//       success: true,
//       response: upload_res,
//       cdn_url: upload_res.secure_url,
//     });
//   } else {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to upload image to Cloudinary",
//     });
//   }
// } catch (error) {
//   console.error("Error:", error);
//   return res.status(500).json({
//     success: false,
//     message: "An error occurred while processing the request",
//   });
// }
// });

module.exports = router;
