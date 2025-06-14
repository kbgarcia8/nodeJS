import { Router } from "express";
import * as messageController from "../controllers/messageController.js"

const messageRouter = Router();

messageRouter.get("/new", messageController.newMessageGet);
messageRouter.post("/new", messageController.newMessagePost);

/*
messageRouter.get("/messages/:index", (req, res) => {
  const index = req.params.index
  res.render("message", { title: `Message ${index}`, message: messages[index] });
});
*/
export default messageRouter;