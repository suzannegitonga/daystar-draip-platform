const mongoose = require('mongoose');

const researchAssetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  school: { type: String, required: true },
  discipline: { type: String, required: true },
  researchQuestion: { type: String },
  datasetAvailability: { type: String },
  sampleSize: { type: String },
  methodology: { type: String },
  findings: { type: String },
  novelty: { type: String },
  potentialUsers: { type: String },
  industryRelevance: { type: String },
  policyRelevance: { type: String },
  commercialPotential: { type: String },
  ipPotential: { type: String },
  publicationPotential: { type: String },
  sdgTheme: { type: String },
  keywords: [{ type: String }],
  status: { type: String, enum: ['draft', 'under review', 'completed', 'archived'], default: 'draft' },
  readinessRating: { type: String, enum: ['Green', 'Amber', 'Red', 'Pending'], default: 'Pending' },
  proposedPathways: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('ResearchAsset', researchAssetSchema);