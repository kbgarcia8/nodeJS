import { Router } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import * as indexController from "../controllers/indexController.js"

const indexRouter = Router();

indexRouter.get("/", asyncHandler(indexController.homePage));

indexRouter.get("/register", asyncHandler(indexController.registerForm));
indexRouter.post("/register", indexController.registerFormPost);
indexRouter.get("/login", asyncHandler(indexController.loginFormGet));
/*
indexRouter.post("/login", passport.authenticate("local", { //"local" is a strategy
    successRedirect: "/login",
    failureRedirect: "/login",
    failureFlash: true
  })
);
indexRouter.get("/logout", asyncHandler(indexController.logOut));
*/

export default indexRouter;