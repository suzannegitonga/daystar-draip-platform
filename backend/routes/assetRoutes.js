const express = require("express");
const router = express.Router();
const multer = require("multer");
const ResearchAsset = require("../models/ResearchAsset");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const assets = await ResearchAsset.find({});
    res.status(200).json({ status: "success", data: assets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    console.log("LOGGED IN USER:", req.user);
    console.log("REQUEST BODY:", req.body);

    const { title, school, discipline, status } = req.body;
    const newAsset = await ResearchAsset.create({
      title,
      school,
      discipline,
      status: status || "draft",
      owner: req.user ? req.user._id : undefined,
    });
    res.status(201).json({ status: "success", data: newAsset });
  } catch (error) {
    console.error("SUBMISSION ERROR:", error.message);
    res.status(400).json({ status: "fail", message: error.message });
  }
});

// @desc    Update a research asset
// @route   PUT /api/assets/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const asset = await ResearchAsset.findById(req.params.id);

    if (!asset) {
      return res
        .status(404)
        .json({ status: "fail", message: "Asset not found" });
    }

    // Check if the user owns the asset OR is an admin/reviewer
    const isOwner =
      asset.owner &&
      req.user &&
      asset.owner.toString() === req.user._id.toString();
    const isAdminOrReviewer =
      req.user && (req.user.role === "admin" || req.user.role === "reviewer");

    if (!isOwner && !isAdminOrReviewer) {
      return res.status(403).json({
        status: "fail",
        message:
          "Access denied: You can only edit your own submissions unless you are an administrator.",
      });
    }

    // Update fields
    asset.title = req.body.title || asset.title;
    asset.school = req.body.school || asset.school;
    asset.discipline = req.body.discipline || asset.discipline;
    asset.status = req.body.status || asset.status;

    const updatedAsset = await asset.save();

    res.status(200).json({
      status: "success",
      data: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @desc    Import CSV
// @route   POST /api/assets/import
// @access  Private
router.post("/import", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please upload a CSV file" });
    }
    res
      .status(200)
      .json({ status: "success", message: "CSV route processed successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
