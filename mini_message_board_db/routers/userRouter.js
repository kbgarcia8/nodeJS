import { Router } from "express";
import * as usersController from "../controlers/usersController.js"
const usersRouter = Router();

usersRouter.get("/", usersController.usersListGet);
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);
usersRouter.get("/update/:id", usersController.usersUpdateGet);
usersRouter.post("/update/:id", usersController.usersUpdatePost);
usersRouter.get("/search", usersController.usersSearch);
usersRouter.get("/search/result", usersController.usersSearchGet);

/*
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);
usersRouter.get("/:id/update", usersController.usersUpdateGet);
usersRouter.post("/:id/update", usersController.usersUpdatePost);
usersRouter.post("/:id/delete", usersController.usersDeletePost);
usersRouter.get("/search", usersController.usersSearch)
usersRouter.get("/search/results", usersController.usersSearchGet)
*/

export default usersRouter;
