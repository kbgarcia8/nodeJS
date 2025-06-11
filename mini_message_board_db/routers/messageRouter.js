import { Router } from "express";

const messageRouter = Router();

const inputs = [
  {
    name: "messageUser",
    label: "User: ",
    type: "text"
  },
  {
    name: "messageText",
    label: "Message: ",
    type: "textarea"
  }
]

messageRouter.get("/", (req, res) => {
  res.render("form", {  title: "New Message", links: links, header: "Post your message!", inputs: inputs});
});

messageRouter.post("/message/new", (req,res) => {
  const { messageUser, messageText } = req.body;

  if (!messageUser || !messageText) {
    return res.status(400).json({ message: 'User and message are required' });
  }

  res.redirect("/")
});


messageRouter.get("/messages/:index", (req, res) => {
  const index = req.params.index
  res.render("message", { title: `Message ${index}`, message: messages[index] });
});

export default messageRouter;