const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createAsset, getAllAssets, importCSV } = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// Protect routes by inserting the middleware before the controller function
router.route('/')
  .post(protect, createAsset)
  .get(protect, getAllAssets);

router.post('/import', protect, upload.single('file'), importCSV);

module.exports = router;