import { Router } from "express";

const indexRouter = Router();

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    const options = { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
    
    return date.toLocaleString("en-US", options).replace(",", "");
};


const links = [
  { href: "/", text: "Board" },
  { href: "/new", text: "New Message" },
  { href: "/create", text: "New User" },
  { href: "/search/user", text: "Search User" },
  { href: "/search/message", text: "Search Message" },
];

indexRouter.get("/", (req, res) => {
  res.render("index", { links: links, title: "Mini Message Board", messages: messages });
});

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
  
  /*res.status(201).json({
    messageUser: 'New message posted',
    post: newMessageEntry
  });*/

  res.redirect("/")
});

indexRouter.get("/messages/:index", (req, res) => {
  const index = req.params.index
  res.render("message", { title: `Message ${index}`, message: messages[index] });
});

export default indexRouter;