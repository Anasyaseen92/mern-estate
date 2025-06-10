// 📄 routes/user.route.js

import express from 'express';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// 🛡️ Protect this route with JWT token verification middleware
router.post('/update/:id', verifyToken, updateUser);

export default router;
