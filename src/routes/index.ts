import { Router } from "express";
import AnalyseRoute from "./analyse.route";

const router = Router();

router.use("/analyse", AnalyseRoute);

export default router;