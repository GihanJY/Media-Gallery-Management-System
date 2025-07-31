const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const { upload } = require("../utils/upload");
const { deleteMedia, downloadZip, getAllMedia, getMediaById, updateMedia, uploadMedia } = require("../controllers/MediaController");

const router = Router();

router.use(auth);

router.get("/", getAllMedia);
router.post("/upload", upload.single('file'), uploadMedia);
router.get("/:id", getMediaById);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);
router.post("/download-zip", downloadZip); 

module.exports = router;