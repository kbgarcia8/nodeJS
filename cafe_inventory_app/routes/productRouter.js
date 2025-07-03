import { Router } from "express";
import * as productController from "../controllers/productController.js"


const productRouter = Router();

productRouter.get("/", productController.listAllProducts);
productRouter.post("/", productController.chooseSortOption);
productRouter.get("/filtered", productController.searchedProducts);
productRouter.get("/edit/:id", productController.editProduct);
productRouter.post("/update/:id", productController.updateProduct);
productRouter.get("/add", productController.addProductGet);
productRouter.post("/add", productController.addProductPost);

export default productRouter;