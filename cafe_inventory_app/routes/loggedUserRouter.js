import { Router } from "express";
import * as loggedUserController from "../controllers/loggedUserController.js";

const loggedUserRouter = Router();

loggedUserRouter.get("/home", loggedUserController.loggedUserHome);

export default loggedUserRouter;