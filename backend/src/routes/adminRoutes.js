const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.use(protect, authorizeRoles("ADMIN"));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/ideas/:id", adminController.getIdeaById);
router.get("/plans", adminController.getPlans);
router.get("/plans/:id", adminController.getPlanById);
router.patch("/plans/:id", adminController.updatePlan);
router.delete("/plans/:id", adminController.deletePlan);
router.get("/payments", adminController.getPayments);
router.get("/payments/:id", adminController.getPaymentById);
router.get("/invoices", adminController.getInvoices);
router.get("/invoices/:id", adminController.getInvoiceById);

module.exports = router;
