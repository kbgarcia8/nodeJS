import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as menuController from "../controllers/menuController.js";

const menuRouter = Router();

menuRouter.get("/", asyncHandler(menuController.getAllMenu));
menuRouter.get("/:category", asyncHandler(menuController.getFilteredMenu));


export default menuRouter;