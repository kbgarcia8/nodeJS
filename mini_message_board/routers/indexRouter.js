import { Router } from "express";

const indexRouter = Router();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  },
  {
    text: "How's everyone doing?",
    user: "Sophia",
    added: new Date()
  },
  {
    text: "Just finished my work!",
    user: "Liam",
    added: new Date()
  },
  {
    text: "Anyone up for a game later?",
    user: "Mia",
    added: new Date()
  },
  {
    text: "Good morning!",
    user: "Noah",
    added: new Date()
  },
  {
    text: "What's the plan for today?",
    user: "Olivia",
    added: new Date()
  },
  {
    text: "Can't wait for the weekend!",
    user: "Ethan",
    added: new Date()
  },
  {
    text: "Just saw an amazing movie.",
    user: "Ava",
    added: new Date()
  },
  {
    text: "Any book recommendations?",
    user: "James",
    added: new Date()
  }
];


indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Mini Message Board", messages: messages });
});

indexRouter.post("/new", (req,res) => {
  const { user, text } = req.body;

  // Basic validation
  if (!user || !text) {
    return res.status(400).json({ message: 'User and message are required' });
  }
  
  res.status(201).json({
    message: 'New message posted',
    post: {user: user, message: text} 
  });
});

export default indexRouter;