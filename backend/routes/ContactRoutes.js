const { Router } = require("express");
const { auth, adminAuth } = require("../middlewares/auth");
const { adminDeleteMessage, createContact, deleteMessage, getAllMessages, getUserMessages, updateMessage } = require("../controllers/ContactController");

const router = Router();

router.post("/", createContact);
router.get("/messages", auth, getUserMessages);
router.put("/:id", auth, updateMessage);
router.delete("/:id", auth, deleteMessage);
router.get("/admin", auth, adminAuth, getAllMessages);
router.delete("/admin/:id", auth, adminAuth, adminDeleteMessage);

module.exports = router;
