import { Router } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import { checkAuthentication } from "../middlewares/authenticate.js";
import * as indexController from "../controllers/indexController.js"

const indexRouter = Router();

indexRouter.get("/", asyncHandler(indexController.homePage));

indexRouter.get("/register", asyncHandler(indexController.registerForm));
indexRouter.post("/register", indexController.registerFormPost);
indexRouter.get("/login", asyncHandler(indexController.loginFormGet));
indexRouter.post("/login", indexController.loginFormPost);
indexRouter.get("/dashboard", checkAuthentication, indexController.dashboardGet); //only use an authentication middleware on protectred routes
//indexRouter.get("/logout", asyncHandler(indexController.logOut));

export default indexRouter;