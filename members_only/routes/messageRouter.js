import { Router } from "express";
import * as messageController from "../controllers/messageController.js"
import { checkAuthentication } from "../middlewares/authenticate.js";

const messageRouter = Router();

messageRouter.get("/", checkAuthentication, messageController.messagesHomeGet);
messageRouter.get("/new", checkAuthentication, messageController.newMessageGet);
messageRouter.post("/new", checkAuthentication, messageController.newMessagePost);
messageRouter.get("/search", checkAuthentication, messageController.messageSearch);
messageRouter.get("/search/result", checkAuthentication, messageController.messageSearchGet);
messageRouter.post("/delete/:id", checkAuthentication, messageController.messageDeletePost);
messageRouter.get("/edit/:id", checkAuthentication, messageController.messageEditGet);
messageRouter.post("/edit/:id", checkAuthentication, messageController.editMessagePost);

export default messageRouter;