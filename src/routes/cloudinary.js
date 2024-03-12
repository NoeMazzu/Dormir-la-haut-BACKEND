const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

router.post('/upload-image', async (req, res) => {
    const token = '123xyz';
    try {
        const image_file = req.files.image;
        const temp_image = `/temp/images/${uniqid()}.jpg`;
        const move_result = await image_file.mv(temp_image);

    if (move_result === undefined) {
        const upload_res = await cloudinary.uploader.upload(temp_image, {
            resource_type: 'image',
            public_id: `images/users-profiles/user-${token}`,
            overwrite: true, //! overwrites the existing picture at specified public_id
        });

        if (upload_res) fs.unlinkSync(temp_image);

        return res.json({
            success: true,
            response: 'success response',
            cdn_url: upload_res.secure_url,
        });
    }
} catch {
    error => {
        console.log('error', error);
        return res.json({
            success: false,
            response: 'catch error response',
            error: 'some shit happened',
        });
    };
}

return res.json({
    success: false,
    response: 'route default response',
    message: 'shit happened outside of the try/catch block',
});
});

module.exports = router;