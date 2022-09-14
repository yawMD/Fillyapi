const express = require("express");
const router = express.Router();
const { body } = require("../middleware/getbody");
const auth = require("../middleware/auth");
const { addChat, getChat } = require("../controllers/chat");

// router.post("/register", body, register);
router.post("/send", auth, body, addChat);
router.post("/get", auth, body, getChat);

module.exports = router;
