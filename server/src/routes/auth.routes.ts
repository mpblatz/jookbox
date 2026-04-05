import { Router } from "express";
import { getSession } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get("/session", getSession);

export default authRoutes;
