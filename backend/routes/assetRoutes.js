const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createAsset, getAllAssets, importCSV } = require('../controllers/assetController');

// Configure multer to store files in memory temporarily
const upload = multer({ storage: multer.memoryStorage() });

// Define routes
router.route('/')
  .post(createAsset)
  .get(getAllAssets);

// Define CSV import route (expects a field named 'file')
router.post('/import', upload.single('file'), importCSV);

module.exports = router;