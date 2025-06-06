import { Router } from "express";
import { createUsernameGet, createUsernamePost } from "../controllers/usersController.js";

const newRouter = Router();

newRouter.get("/", createUsernameGet);
newRouter.post("/", createUsernamePost);

export default newRouter;