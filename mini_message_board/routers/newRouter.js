import { Router } from "express";

const newRouter = Router();

const inputs = [
  {
    name: "user",
    label: "User: ",
    type: "text"
  },
  {
    name: "message",
    label: "Message: ",
    type: "textarea"
  }
]

newRouter.get("/", (req, res) => {
  res.render("form", { header: "Post your message!", inputs: inputs});
});
/*newRouter.get("/:newId", (req, res) => {
  const { newId } = req.params;
  res.send(`Book ID: ${newId}`);
});*/

export default newRouter;