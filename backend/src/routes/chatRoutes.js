import express from "express";
import { saveChat, getChats, getChatById } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", protect, saveChat);
router.get("/", protect, getChats);
router.get("/:id", protect, getChatById);

export default router;
