import { Router } from "express";
import { getAllMenu, loggedUserHome} from "../controllers/loggedUserController.js";

const loggedUserRouter = Router();

loggedUserRouter.get("/home", loggedUserHome);
loggedUserRouter.get("/menu", getAllMenu);

export default loggedUserRouter;