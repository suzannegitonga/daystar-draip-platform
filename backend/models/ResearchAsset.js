const mongoose = require("mongoose");

const pathwaySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "journal_article",
        "policy_brief",
        "dashboard",
        "partnership",
        "grant_concept",
        "ip_filing",
      ],
    },
    rationale: String,
    confidence: Number,
  },
  { _id: false },
);

const researchAssetSchema = new mongoose.Schema(
  {
    // Identification
    title: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    school: { type: String, required: true, trim: true },
    discipline: { type: String, required: true, trim: true },
    assetType: {
      type: String,
      enum: [
        "Thesis",
        "Dataset",
        "Paper",
        "Prototype",
        "Algorithm",
        "Innovation",
      ],
      required: true,
    },

    // Research substance
    researchQuestion: { type: String, trim: true },
    datasetAvailability: { type: String, trim: true },
    sampleSize: { type: String, trim: true },
    methodology: { type: String, trim: true },
    findings: { type: String, trim: true },
    novelty: { type: String, trim: true },

    // Application potential
    potentialUsers: { type: String, trim: true },
    industryRelevance: { type: String, trim: true },
    policyRelevance: { type: String, trim: true },
    commercialPotential: { type: String, trim: true },
    ipPotential: { type: String, trim: true },
    publicationPotential: { type: String, trim: true },

    // Classification & status
    sdgTheme: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "completed", "archived"],
      default: "draft",
    },

    // AI & reviewer layer (Phase 2)
    aiReadinessRating: { type: String, enum: ["Green", "Amber", "Red"] },
    aiSuggestedPathways: [pathwaySchema],
    confirmedPathways: [pathwaySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("ResearchAsset", researchAssetSchema);
