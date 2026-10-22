const mongoose = require("mongoose");

const researchAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    discipline: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "draft",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ResearchAsset", researchAssetSchema);
