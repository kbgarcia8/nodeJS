import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";
const usersRouter = Router();

usersRouter.get("/", checkAuthentication, usersController.usersList);
//usersRouter.get("/create", checkAuthentication, usersController.usersCreateGet);
//usersRouter.post("/create", checkAuthentication, usersController.usersCreatePost);
//usersRouter.get("/update/:id", checkAuthentication, usersController.usersUpdateGet);
//usersRouter.post("/update/:id", checkAuthentication, usersController.usersUpdatePost);
//usersRouter.post("/delete/:id", checkAuthentication, usersController.userDelete);
usersRouter.get("/search", checkAuthentication, usersController.usersSearch);
//usersRouter.get("/search/result", checkAuthentication, usersController.usersSearchGet);

export default usersRouter;
