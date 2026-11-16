const ResearchAsset = require("../models/ResearchAsset");
const csv = require("csv-express");

// @desc    Create a new research asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    const asset = await ResearchAsset.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json({ status: "success", data: asset });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get all research assets (with optional filters)
// @route   GET /api/assets
const getAllAssets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.school) filter.school = req.query.school;
    if (req.query.sdgTheme) filter.sdgTheme = req.query.sdgTheme;

    const assets = await ResearchAsset.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: assets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get single research asset
// @route   GET /api/assets/:id
const getAssetById = async (req, res) => {
  try {
    const asset = await ResearchAsset.findById(req.params.id);
    if (!asset)
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });
    res.status(200).json({ status: "success", data: asset });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Update a research asset
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
  try {
    const asset = await ResearchAsset.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!asset)
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });
    res.status(200).json({ status: "success", data: asset });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Delete a research asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
  try {
    const asset = await ResearchAsset.findByIdAndDelete(req.params.id);
    if (!asset)
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });
    res.status(200).json({ status: "success", message: "Asset deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Import assets from CSV
// @route   POST /api/assets/import
const importCSV = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ status: "error", message: "No file uploaded" });

    const content = req.file.buffer.toString("utf-8");
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length < 2)
      return res
        .status(400)
        .json({
          status: "error",
          message: "CSV file is empty or has no data rows",
        });

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));
    const requiredHeaders = ["title", "school", "discipline", "assetType"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return res
        .status(400)
        .json({
          status: "error",
          message: `Missing required columns: ${missingHeaders.join(", ")}`,
        });
    }

    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((v) => v.trim().replace(/^"|"$/g, ""));
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });

      if (!row.title || !row.school || !row.discipline || !row.assetType) {
        skipped++;
        errors.push({ row: i + 1, reason: "Missing required field(s)" });
        continue;
      }

      try {
        await ResearchAsset.create({ ...row, owner: req.user.id });
        imported++;
      } catch (err) {
        skipped++;
        errors.push({ row: i + 1, reason: err.message });
      }
    }

    res.status(200).json({ status: "success", imported, skipped, errors });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Update AI readiness rating (reviewer/admin only)
// @route   PATCH /api/assets/:id/rating
const updateAiRating = async (req, res) => {
  try {
    const { aiReadinessRating } = req.body;
    if (!["Green", "Amber", "Red"].includes(aiReadinessRating)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Rating must be Green, Amber, or Red",
        });
    }

    const isPrivileged =
      req.user.role === "admin" || req.user.role === "reviewer";
    if (!isPrivileged) {
      return res
        .status(403)
        .json({
          status: "error",
          message: "Only reviewers and admins can set AI readiness rating",
        });
    }

    const asset = await ResearchAsset.findByIdAndUpdate(
      req.params.id,
      { aiReadinessRating },
      { new: true, runValidators: true },
    );

    if (!asset) {
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });
    }

    res.status(200).json({ status: "success", data: asset });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Export assets as CSV download
// @route   GET /api/assets/export/csv
const exportCSV = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.school) filter.school = req.query.school;
    if (req.query.sdgTheme) filter.sdgTheme = req.query.sdgTheme;

    const assets = await ResearchAsset.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const rows = assets.map((a) => ({
      Title: a.title,
      Type: a.assetType,
      School: a.school,
      Discipline: a.discipline,
      SDG_Theme: a.sdgTheme,
      Status: a.status,
      AI_Rating: a.aiReadinessRating || "",
      Keywords: (a.keywords || []).join("; "),
      Created: new Date(a.createdAt).toISOString().split("T")[0],
    }));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=draip-assets-export.csv",
    );
    res.csv(rows, true);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  importCSV,
  updateAiRating,
  exportCSV,
};
