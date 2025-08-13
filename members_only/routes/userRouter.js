import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";
const usersRouter = Router();

//guest access
usersRouter.get("/upgrade", checkAuthentication, usersController.upgradeMembershipGet);
usersRouter.post("/upgrade", checkAuthentication, usersController.upgradeMembershipPost);
//member access
usersRouter.get("/search", checkAuthentication, usersController.usersSearch);
usersRouter.get("/search/result", checkAuthentication, usersController.usersSearchGet);

//member and admin access
usersRouter.get("/", checkAuthentication, usersController.usersList);
usersRouter.get("/create", checkAuthentication, usersController.usersCreateGet);
usersRouter.post("/create", checkAuthentication, usersController.usersCreatePost);
usersRouter.get("/update/:id", checkAuthentication, usersController.usersUpdateGet);
usersRouter.post("/update/:id", checkAuthentication, usersController.usersUpdatePost);
usersRouter.post("/delete/:id", checkAuthentication, usersController.userDelete);

export default usersRouter;
