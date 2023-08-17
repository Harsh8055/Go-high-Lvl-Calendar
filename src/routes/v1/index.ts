import express from "express";
import eventRoutes from "./eventRoutes";

const router = express.Router();

// User
router.use("/event", eventRoutes);

export default router;
