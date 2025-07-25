import { Router } from "express";
import * as messageController from "../controllers/messageController.js"

const messageRouter = Router();

messageRouter.get("/", messageController.newMessageGet);
messageRouter.post("/new", messageController.newMessagePost);
messageRouter.get("/search", messageController.messageSearch);
messageRouter.get("/search/result", messageController.messageSearchGet);
messageRouter.get("/view/:id", messageController.messageView);
messageRouter.post("/delete/:id", messageController.messageDeletePost);

export default messageRouter;