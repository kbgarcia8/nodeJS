import { Router } from "express";
import * as productController from "../controllers/productController.js"


const productRouter = Router();

productRouter.get("/", productController.listAllProuducts);
productRouter.post("/", productController.listSortedByProuducts);

//Continue here
export default productRouter;