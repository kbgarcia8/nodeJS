import { Router } from "express";
import { tempHomePage } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", tempHomePage);

export default indexRouter;