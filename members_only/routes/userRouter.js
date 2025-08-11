import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";
const usersRouter = Router();

//member access
usersRouter.get("/search", checkAuthentication, usersController.usersSearch);
usersRouter.get("/search/result", checkAuthentication, usersController.usersSearchGet);

//member and admin access
usersRouter.get("/", checkAuthentication, usersController.usersList);
usersRouter.get("/create", checkAuthentication, usersController.usersCreateGet);
usersRouter.post("/create", checkAuthentication, usersController.usersCreatePost);
usersRouter.get("/update/:id", checkAuthentication, usersController.usersUpdateGet);
/*
usersRouter.post("/update/:id", usersController.usersUpdatePost);
usersRouter.post("/delete/:id", usersController.userDeletePost);
*/
export default usersRouter;
