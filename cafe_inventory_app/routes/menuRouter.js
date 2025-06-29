import { Router } from "express";
import * as menuController from "../controllers/menuController.js";

const menuRouter = Router();

menuRouter.get("/", menuController.getAllMenu);
menuRouter.get("/:category", menuController.getFilteredMenu);


export default menuRouter;