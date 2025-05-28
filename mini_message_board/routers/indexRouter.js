import { Router } from "express";

const indexRouter = Router();

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    const options = { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
    
    return date.toLocaleString("en-US", options).replace(",", "");
};

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: formatDate(new Date())
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: formatDate(new Date())
  },
  {
    text: "How's everyone doing?",
    user: "Sophia",
    added: formatDate(new Date())
  },
  {
    text: "Just finished my work!",
    user: "Liam",
    added: formatDate(new Date())
  },
  {
    text: "Anyone up for a game later?",
    user: "Mia",
    added: formatDate(new Date())
  },
  {
    text: "Good morning!",
    user: "Noah",
    added: formatDate(new Date())
  },
  {
    text: "What's the plan for today?",
    user: "Olivia",
    added: formatDate(new Date())
  },
  {
    text: "Can't wait for the weekend!",
    user: "Ethan",
    added: formatDate(new Date())
  },
  {
    text: "Just saw an amazing movie.",
    user: "Ava",
    added: formatDate(new Date())
  },
  {
    text: "Any book recommendations?",
    user: "James",
    added: formatDate(new Date())
  }
];

const links = [
  { href: "/", text: "Board" },
  { href: "new", text: "New Message" },
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