const ResearchAsset = require("../models/ResearchAsset");
const User = require("../models/User");
const csv = require("csv-parser");
const stream = require("stream");

// Allowed fields for create/update (matches schema §3.1)
const ALLOWED_FIELDS = [
  "title",
  "school",
  "discipline",
  "assetType",
  "researchQuestion",
  "datasetAvailability",
  "sampleSize",
  "methodology",
  "findings",
  "novelty",
  "potentialUsers",
  "industryRelevance",
  "policyRelevance",
  "commercialPotential",
  "ipPotential",
  "publicationPotential",
  "sdgTheme",
  "keywords",
  "status",
];

function pickAllowed(body) {
  const clean = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (body[f] !== undefined) clean[f] = body[f];
  });
  return clean;
}

// @desc    Create a new research asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    const data = pickAllowed(req.body);
    data.owner = req.user._id;
    const asset = await ResearchAsset.create(data);
    res.status(201).json({ status: "success", data: asset });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// @desc    Get all research assets
// @route   GET /api/assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await ResearchAsset.find().populate("owner", "name email");
    res
      .status(200)
      .json({ status: "success", count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
const getAssetById = async (req, res) => {
  try {
    const asset = await ResearchAsset.findById(req.params.id).populate(
      "owner",
      "name email",
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

// @desc    Update asset (researcher can only edit own; admin/reviewer can edit any)
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
  try {
    const asset = await ResearchAsset.findById(req.params.id);
    if (!asset)
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });

    const isOwner =
      asset.owner && asset.owner.toString() === req.user._id.toString();
    const isPrivileged =
      req.user.role === "admin" || req.user.role === "reviewer";
    if (!isOwner && !isPrivileged) {
      return res
        .status(403)
        .json({ status: "error", message: "Not authorized" });
    }

    const data = pickAllowed(req.body);
    const updated = await ResearchAsset.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
  try {
    const asset = await ResearchAsset.findById(req.params.id);
    if (!asset)
      return res
        .status(404)
        .json({ status: "error", message: "Asset not found" });

    const isOwner =
      asset.owner && asset.owner.toString() === req.user._id.toString();
    const isPrivileged =
      req.user.role === "admin" || req.user.role === "reviewer";
    if (!isOwner && !isPrivileged) {
      return res
        .status(403)
        .json({ status: "error", message: "Not authorized" });
    }

    await asset.deleteOne();
    res.status(200).json({ status: "success", message: "Asset deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Bulk import assets from CSV with validation (§10.33)
// @route   POST /api/assets/import
const importCSV = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", message: "No CSV file uploaded" });
  }

  const VALID_STATUSES = [
    "draft",
    "submitted",
    "under_review",
    "completed",
    "archived",
  ];
  const VALID_ASSET_TYPES = [
    "Thesis",
    "Dataset",
    "Paper",
    "Prototype",
    "Algorithm",
    "Innovation",
  ];
  const REQUIRED_FIELDS = ["title", "school", "discipline"];

  const results = [];
  const errors = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv())
    .on("data", (row) => {
      const rowNum = results.length + errors.length + 1;
      const get = (...keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && String(row[k]).trim() !== "")
            return String(row[k]).trim();
        }
        return undefined;
      };

      const title = get("Title", "title");
      const school = get("School", "school");
      const discipline = get("Discipline", "discipline");

      // Required field validation
      const missing = [];
      if (!title) missing.push("title");
      if (!school) missing.push("school");
      if (!discipline) missing.push("discipline");
      if (missing.length > 0) {
        errors.push({
          row: rowNum,
          reason: `Missing required fields: ${missing.join(", ")}`,
        });
        return;
      }

      // Asset type validation
      const rawType = get("AssetType", "assetType", "Type", "type") || "Thesis";
      const assetType = VALID_ASSET_TYPES.find(
        (t) => t.toLowerCase() === rawType.toLowerCase(),
      );
      if (!assetType) {
        errors.push({
          row: rowNum,
          title,
          reason: `Invalid assetType: "${rawType}". Must be one of: ${VALID_ASSET_TYPES.join(", ")}`,
        });
        return;
      }

      // Status validation
      const rawStatus = get("Status", "status") || "draft";
      const status = VALID_STATUSES.find(
        (s) => s.toLowerCase() === rawStatus.toLowerCase().replace(/\s+/g, "_"),
      );
      if (!status) {
        errors.push({
          row: rowNum,
          title,
          reason: `Invalid status: "${rawStatus}". Must be one of: ${VALID_STATUSES.join(", ")}`,
        });
        return;
      }

      // Keywords parsing
      const rawKeywords = get("Keywords", "keywords");
      const keywords = rawKeywords
        ? rawKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [];

      const entry = {
        title,
        school,
        discipline,
        assetType,
        status,
        keywords,
        researchQuestion: get("ResearchQuestion", "researchQuestion"),
        datasetAvailability: get("DatasetAvailability", "datasetAvailability"),
        sampleSize: get("SampleSize", "sampleSize"),
        methodology: get("Methodology", "methodology"),
        findings: get("Findings", "findings"),
        novelty: get("Novelty", "novelty"),
        potentialUsers: get("PotentialUsers", "potentialUsers"),
        industryRelevance: get("IndustryRelevance", "industryRelevance"),
        policyRelevance: get("PolicyRelevance", "policyRelevance"),
        commercialPotential: get("CommercialPotential", "commercialPotential"),
        ipPotential: get("IpPotential", "ipPotential"),
        publicationPotential: get(
          "PublicationPotential",
          "publicationPotential",
        ),
        sdgTheme: get("SdgTheme", "sdgTheme", "SDG"),
        owner: req.user._id,
      };

      results.push(entry);
    })
    .on("end", async () => {
      try {
        // Duplicate detection by title + school
        const existingAssets = await ResearchAsset.find({
          title: { $in: results.map((r) => r.title) },
          school: { $in: results.map((r) => r.school) },
        }).select("title school");
        const existingSet = new Set(
          existingAssets.map((a) => `${a.title}|||${a.school}`),
        );

        const toInsert = [];
        results.forEach((entry, idx) => {
          const key = `${entry.title}|||${entry.school}`;
          if (existingSet.has(key)) {
            errors.push({
              row: idx + 1,
              title: entry.title,
              reason:
                "Duplicate: asset with same title and school already exists",
            });
          } else {
            toInsert.push(entry);
            existingSet.add(key); // prevent duplicates within the same CSV
          }
        });

        let insertedCount = 0;
        if (toInsert.length > 0) {
          const inserted = await ResearchAsset.insertMany(toInsert);
          insertedCount = inserted.length;
        }

        res.status(201).json({
          status: "success",
          imported: insertedCount,
          skipped: errors.length,
          errors: errors.length > 0 ? errors : undefined,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Database insertion failed: " + error.message,
        });
      }
    });
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

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  importCSV,
  updateAiRating,
};
