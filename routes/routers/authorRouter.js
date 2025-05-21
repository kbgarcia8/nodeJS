import { Router } from "express";
import getAuthorById from "../controllers/authorController.js"

const authorRouter = Router();

authorRouter.get("/", (req, res) => res.send("All authors"));
authorRouter.get("/:authorId", getAuthorById);

export default authorRouter;

/*
1. The route path contains a route parameter (/authors/:authorId). The controller extracts the authorId from req.params.
2. It then invokes a database query function getAuthorById to retrieve the author data based on the authorId.
3. If the controller doesn’t find the author, it sends a response with a 404 status code and the message "Author not found", using res.status(404).send(...). It then returns from the controller function to avoid invoking any other logic in the controller, as sending a response doesn’t automatically stop the function execution.
4. If the controller finds the author, it sends a response with a 200 status code with the text showing the author name using res.send(...).
*/