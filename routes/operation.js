const express = require("express");
const router = express.Router();
const operationController = require("../controllers/operation");
const auth = require("../middleware/auth");

router.post("/", auth, operationController.createOperation);

router.get("/", auth, operationController.getAllOperations);

router.get("/:id", auth, operationController.getOneOperation);

module.exports = router;
