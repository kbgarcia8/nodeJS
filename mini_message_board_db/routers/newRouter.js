import { Router } from "express";

const newRouter = Router();

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

const links = [
  { href: "/", text: "Board" },
  { href: "/new", text: "New Message" },
  { href: "/create", text: "New User" },
  { href: "/search/user", text: "Search User" },
  { href: "/search/message", text: "Search Message" },
];

newRouter.get("/", (req, res) => {
  res.render("form", {  title: "New Message", links: links, header: "Post your message!", inputs: inputs});
});

export default newRouter;