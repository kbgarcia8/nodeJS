import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.send("Welcome to Home page"));

export default indexRouter;