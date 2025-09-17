import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkAuthentication } from "../middlewares/authenticate.js";
import * as filesController from "../controllers/filesController.js"

const filesRouter = Router();

filesRouter.get("/", checkAuthentication, filesController.filesHome);
filesRouter.get("/new", checkAuthentication, asyncHandler(filesController.uploadFileGet));
filesRouter.post("/new", checkAuthentication, ...filesController.uploadFilePost);
filesRouter.get("/delete/:id", checkAuthentication, filesController.deleteFile);
filesRouter.get("/view/:id", checkAuthentication, filesController.viewFile);
filesRouter.get("/download/:id", checkAuthentication, filesController.downloadFile);
filesRouter.get("/search", checkAuthentication, filesController.searchFile);
filesRouter.get("/search/results", checkAuthentication, filesController.fileSearchResult);

export default filesRouter;