import { Router } from "express";
import * as productController from "../controllers/productController.js"


const productRouter = Router();

productRouter.get("/", productController.listAllProducts);
productRouter.post("/", productController.chooseSortOption);
productRouter.get("/filtered", productController.searchedProducts);
productRouter.get("/edit/:id", productController.editProductGet);
productRouter.post("/edit/:id", productController.editProductPost);

export default productRouter;