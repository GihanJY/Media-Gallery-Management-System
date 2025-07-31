const { Router } = require("express");
const { deleteMedia, downloadZip, getAllMedia, getMediaById, updateMedia, uploadMedia } = require("../controllers/MediaController");

const router = Router();

router.get("/", getAllMedia);
router.get("/:id", downloadZip);
router.get("/:id", getMediaById);
router.post("/", uploadMedia);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;