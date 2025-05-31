import { Router } from "express";
import { usersListGet, usersCreateGet, usersCreatePost } from "../controllers/userController.js";
const usersRouter = Router();

usersRouter.get("/", usersListGet);
usersRouter.get("/create", usersCreateGet);
usersRouter.post("/create", usersCreatePost);

export default usersRouter;
