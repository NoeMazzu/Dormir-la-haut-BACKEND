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

// //! ROUTE MEWEN
router.post('/upload-image-mewen', async (req, res) => {
  try {
      const image_file = req.files.photoNewPoi;
      const temp_image = `/tmp/${uniqid()}.jpg`;

      const move_result = await image_file.mv(temp_image);

      if (move_result === undefined) {
          const upload_res = await cloudinary.uploader.upload(temp_image, {
              resource_type: 'image',
              public_id: `DLH/poi-${uniqid()}`,
              overwrite: false, //! overwrites the existing picture at specified public_id
          });

          if (upload_res.secure_url) {
              fs.unlinkSync(temp_image);
              return res.status(201).json({
                  success: true,
                  response: upload_res,
                  cdn_url: upload_res.secure_url,
              });
          }
      }
  } catch (error) {
      return res.status(500).json({
          success: false,
          response: 'try/catch block error response',
          message: error,
      });
  }

  return res.status(500).json({
      success: false,
      response: 'route default response',
      message: 'something wrong happened outside of the try/catch block',
  });
});

module.exports = router;
