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

// @desc    Bulk import assets from CSV
// @route   POST /api/assets/import
const importCSV = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", message: "No CSV file uploaded" });
  }

  const results = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv())
    .on("data", (row) => {
      const get = (...keys) => {
        for (const k of keys)
          if (row[k] !== undefined && row[k] !== "") return row[k];
        return undefined;
      };
      const entry = {
        title: get("Title", "title"),
        school: get("School", "school"),
        discipline: get("Discipline", "discipline"),
        assetType: get("AssetType", "assetType", "Type", "type") || "Thesis",
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
        keywords: get("Keywords", "keywords")
          ? String(get("Keywords", "keywords"))
              .split(",")
              .map((k) => k.trim())
          : [],
        status: get("Status", "status")
          ? String(get("Status", "status")).toLowerCase()
          : "draft",
        owner: req.user._id,
      };
      // Drop undefined keys
      Object.keys(entry).forEach(
        (k) => entry[k] === undefined && delete entry[k],
      );
      results.push(entry);
    })
    .on("end", async () => {
      try {
        const inserted = await ResearchAsset.insertMany(results);
        res
          .status(201)
          .json({ status: "success", count: inserted.length, data: inserted });
      } catch (error) {
        res
          .status(500)
          .json({
            status: "error",
            message: "Database insertion failed: " + error.message,
          });
      }
    });
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  importCSV,
};