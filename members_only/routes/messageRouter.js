import { Router } from "express";
import * as messageController from "../controllers/messageController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";

const messageRouter = Router();

messageRouter.get("/", checkAuthentication, messageController.messagesHomeGet);
messageRouter.get("/new", checkAuthentication, messageController.newMessageGet);
messageRouter.post("/new", checkAuthentication, messageController.newMessagePost);
messageRouter.get("/search", checkAuthentication, messageController.messageSearch);
/*
messageRouter.get("/search/result", messageController.messageSearchGet);
messageRouter.get("/view/:id", messageController.messageView);
messageRouter.post("/delete/:id", messageController.messageDeletePost);
*/
export default messageRouter;