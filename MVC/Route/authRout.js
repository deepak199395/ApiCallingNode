import express from "express";
import { createUser } from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", createUser);

export default router;
