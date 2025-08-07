import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
const usersRouter = Router();

//member access
//usersRouter.get("/search", usersController.usersSearch);
//usersRouter.get("/search/result", usersController.usersSearchGet);
/*
//member and admin access
usersRouter.get("/", usersController.usersListGet);
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);
usersRouter.get("/update/:id", usersController.usersUpdateGet);
usersRouter.post("/update/:id", usersController.usersUpdatePost);
usersRouter.post("/delete/:id", usersController.userDeletePost);
*/
export default usersRouter;
