import express from 'express';
import health from './health.js';
import auth from './auth.js';
import ai from './ai.js'
import chatRoutes from "./chatRoutes.js";

const router = express.Router();

router.use('/health', health);
router.use('/auth', auth);
router.use('/ai', ai);
router.use("/chats", chatRoutes);

export default router;
