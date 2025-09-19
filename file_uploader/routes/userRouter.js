import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
import { checkAuthentication, checkAdminAccess } from "../middlewares/authenticate.js";
const usersRouter = Router();

//guest access
usersRouter.get("/upgrade", checkAuthentication, usersController.upgradeMembershipGet);
usersRouter.post("/upgrade", checkAuthentication, usersController.upgradeMembershipPost);

//admin access
usersRouter.get("/", checkAdminAccess, usersController.usersList);
usersRouter.get("/create", checkAdminAccess, usersController.usersCreateGet);
usersRouter.post("/create", checkAdminAccess, usersController.usersCreatePost);
usersRouter.get("/update/:id", checkAdminAccess, usersController.usersUpdateGet);
usersRouter.post("/update/:id", checkAdminAccess, usersController.usersUpdatePost);
usersRouter.post("/delete/:id", checkAdminAccess, usersController.userDelete);
usersRouter.get("/search", checkAdminAccess, usersController.usersSearch);
usersRouter.get("/search/result", checkAdminAccess, usersController.usersSearchGet);

export default usersRouter;
