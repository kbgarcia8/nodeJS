import { Router } from "express";
import * as productController from "../controllers/productController.js"


const productRouter = Router();

productRouter.get("/", productController.listAllProducts);
productRouter.post("/", productController.chooseSortOption);
productRouter.get("/filtered", productController.searchedProducts)

export default productRouter;