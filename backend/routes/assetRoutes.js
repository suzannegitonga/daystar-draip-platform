const express = require('express');
const router = express.Router();
const { createAsset, getAllAssets } = require('../controllers/assetController');

// Define routes
router.route('/')
  .post(createAsset)
  .get(getAllAssets);

module.exports = router;