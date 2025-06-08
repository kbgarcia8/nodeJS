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
  { href: "new", text: "New Message" },
];

newRouter.get("/", (req, res) => {
  res.render("form", {  title: "New Message", links: links, header: "Post your message!", inputs: inputs});
});
/*newRouter.get("/:newId", (req, res) => {
  const { newId } = req.params;
  res.send(`Book ID: ${newId}`);
});*/

export default newRouter;