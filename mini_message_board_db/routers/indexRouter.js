import { Router } from "express";
import { getAllMessages } from "../controllers/indexController.js";

const indexRouter = Router();

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    const options = { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
    
    return date.toLocaleString("en-US", options).replace(",", "");
};

indexRouter.get("/", getAllMessages);

export default indexRouter;