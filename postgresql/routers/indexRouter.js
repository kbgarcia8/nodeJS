import { Router } from "express";

const indexRouter = Router();
import { getUsernames, searchUserGet } from "../controllers/usersController.js";
//if you want to use same path for different logic/controller

indexRouter.get("/", async(req, res) => {
  const { search } = req.query;

    if (search) {
      return await searchUserGet(req, res);
    } else {
      return await getUsernames(req, res);
    }
});


/*
indexRouter.post("/new", (req,res) => {
  const { messageUser, messageText } = req.body;

  if (!messageUser || !messageText) {
    return res.status(400).json({ message: 'User and message are required' });
  }

  const newMessageEntry = {
    text: messageText,
    user: messageUser,
    added: formatDate(new Date())
  };

  messages.push(newMessageEntry)
  
  res.status(201).json({
    messageUser: 'New message posted',
    post: newMessageEntry
  });

  res.redirect("/")
});

indexRouter.get("/messages/:index", (req, res) => {
  const index = req.params.index
  res.render("message", { title: `Message ${index}`, message: messages[index] });
});
*/

export default indexRouter;