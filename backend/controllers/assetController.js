const ResearchAsset = require('../models/ResearchAsset');

// @desc    Create a new research asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    const asset = new ResearchAsset(req.body);
    const savedAsset = await asset.save();
    res.status(201).json({ status: 'success', data: savedAsset });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all research assets
// @route   GET /api/assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await ResearchAsset.find().populate('owner', 'name email');
    res.status(200).json({ status: 'success', count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createAsset,
  getAllAssets
};