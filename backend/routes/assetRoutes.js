const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  importCSV,
  updateAiRating,
  exportCSV,
} = require("../controllers/assetController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, getAllAssets);
router.get("/export/csv", protect, exportCSV);
router.get("/:id", protect, getAssetById);
router.post("/", protect, createAsset);
router.put("/:id", protect, updateAsset);
router.delete("/:id", protect, deleteAsset);
router.post("/import", protect, upload.single("file"), importCSV);
router.patch("/:id/rating", protect, updateAiRating);

module.exports = router;
