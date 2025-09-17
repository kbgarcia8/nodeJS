import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkAuthentication } from "../middlewares/authenticate.js";
import * as foldersController from "../controllers/foldersController.js"

const foldersRouter = Router();

foldersRouter.get("/", checkAuthentication, foldersController.foldersHome);
foldersRouter.get("/view/:name", checkAuthentication, foldersController.viewFilesOfFolder);
foldersRouter.get("/search", checkAuthentication, foldersController.searchFolder);
foldersRouter.get("/search/results", checkAuthentication, foldersController.folderSearchResult);

export default foldersRouter;