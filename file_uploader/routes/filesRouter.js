import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkAuthentication } from "../middlewares/authenticate.js";
import * as filesController from "../controllers/filesController.js"

const filesRouter = Router();

filesRouter.get("/", checkAuthentication, filesController.filesHome);
filesRouter.get("/new", checkAuthentication, asyncHandler(filesController.uploadFileGet));
filesRouter.post("/new", checkAuthentication, ...filesController.uploadFilePost);
filesRouter.get("/delete/:id", checkAuthentication, filesController.deleteFile)

export default filesRouter;