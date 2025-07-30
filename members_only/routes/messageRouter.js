import { Router } from "express";
import * as messageController from "../controllers/messageController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";

const messageRouter = Router();

messageRouter.get("/", checkAuthentication, messageController.messagesHome);
/*
messageRouter.post("/new", messageController.newMessagePost);
messageRouter.get("/search", messageController.messageSearch);
messageRouter.get("/search/result", messageController.messageSearchGet);
messageRouter.get("/view/:id", messageController.messageView);
messageRouter.post("/delete/:id", messageController.messageDeletePost);
*/
export default messageRouter;