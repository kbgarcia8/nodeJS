import { Router } from "express";

const newRouter = Router();

newRouter.get("/", (req, res) => res.send("You have a new message"));
/*newRouter.get("/:newId", (req, res) => {
  const { newId } = req.params;
  res.send(`Book ID: ${newId}`);
});*/

export default newRouter;