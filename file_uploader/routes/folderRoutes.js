import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkAuthentication } from "../middlewares/authenticate.js";
import * as foldersController from "../controllers/foldersController.js"

const foldersRouter = Router();

foldersRouter.get("/", checkAuthentication, foldersController.foldersHome);

export default foldersRouter;