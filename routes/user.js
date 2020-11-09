const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Creating a user account
router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);

module.exports = router;
