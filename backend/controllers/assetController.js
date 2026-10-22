const ResearchAsset = require('../models/ResearchAsset');
const User = require('../models/User');
const csv = require('csv-parser');
const stream = require('stream');

// @desc    Create a new research asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    req.body.owner = req.user._id; // Dynamically assign the logged-in user
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

// @desc    Bulk import assets from CSV
// @route   POST /api/assets/import
const importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No CSV file uploaded' });
  }

  const results = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv())
    .on('data', (data) => {
      // Map CSV columns to our schema
      results.push({
        title: data.Title || data.title,
        school: data.School || data.school,
        discipline: data.Discipline || data.discipline,
        status: data.Status ? data.Status.toLowerCase() : 'draft',
        owner: req.user._id // Dynamically assign the logged-in user
      });
    })
    .on('end', async () => {
      try {
        const inserted = await ResearchAsset.insertMany(results);
        res.status(201).json({ status: 'success', count: inserted.length, data: inserted });
      } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database insertion failed: ' + error.message });
      }
    });
};

module.exports = {
  createAsset,
  getAllAssets,
  importCSV
};