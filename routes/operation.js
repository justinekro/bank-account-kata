const express = require("express");
const router = express.Router();
const operationController = require("../controllers/operation");

router.post("/", operationController.createOperation);

router.get("/", operationController.getAllOperations);

router.get("/:id", operationController.getOneOperation);

module.exports = router;
