import express from 'express';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary and get the secure URL back
// @access  Private
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during upload' });
  }
});

export default router;
