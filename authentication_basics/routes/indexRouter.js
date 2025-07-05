import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as indexController from "../controllers/indexController.js"

const indexRouter = Router();

indexRouter.get("/", asyncHandler(indexController.indexPage));
indexRouter.get("/signup", asyncHandler(indexController.signUpForm));
indexRouter.post("/signup", asyncHandler(indexController.signUpFormPost));


export default indexRouter;