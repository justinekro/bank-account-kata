const express = require("express");
const router = express.Router();
const operationsController = require("../controllers/operations");

// Creating a bank operation
router.post("/", operationsController.createOperation);

router.get("/", operationsController.getAllOperations);

router.get("/:id", operationsController.getOneOperation);

module.exports = router;
