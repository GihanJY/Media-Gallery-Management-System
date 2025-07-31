const { Router } = require("express");
const { adminDeleteMessage, createContact, deleteMessage, getAllMessages, getUserMessages, updateMessage } = require("../controllers/ContactController");

const router = Router();

router.get("/", getAllMessages);
router.get("/", getUserMessages);
router.post("/", createContact);
router.put("/", updateMessage);
router.delete("/", adminDeleteMessage);
router.delete("/", deleteMessage);

module.exports = router;
