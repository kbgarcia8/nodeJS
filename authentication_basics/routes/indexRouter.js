import { Router } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import * as indexController from "../controllers/indexController.js"

const indexRouter = Router();

indexRouter.get("/", asyncHandler(indexController.indexPage));
indexRouter.get("/signup", asyncHandler(indexController.signUpForm));
indexRouter.post("/signup", asyncHandler(indexController.signUpFormPost));
indexRouter.get("/login", asyncHandler(indexController.loginFormGet));
indexRouter.post("/login", asyncHandler(passport.authenticate("local", { //"local" is a strategy
    successRedirect: "/login",
    failureRedirect: "/"
  }))
);
indexRouter.get("/logout", asyncHandler(indexController.logOut));

export default indexRouter;