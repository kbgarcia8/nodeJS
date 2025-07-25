import { Router } from "express";
import * as usersController from "../controllers/usersController.js"
const usersRouter = Router();

usersRouter.get("/", usersController.usersListGet);
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);
usersRouter.get("/update/:id", usersController.usersUpdateGet);
usersRouter.post("/update/:id", usersController.usersUpdatePost);
usersRouter.get("/search", usersController.usersSearch);
usersRouter.get("/search/result", usersController.usersSearchGet);
usersRouter.post("/delete/:id", usersController.userDeletePost);

export default usersRouter;
