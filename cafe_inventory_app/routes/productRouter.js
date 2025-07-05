import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as productController from "../controllers/productController.js"


const productRouter = Router();

productRouter.get("/", asyncHandler(productController.listAllProducts));
productRouter.post("/", asyncHandler(productController.chooseSortOption));
productRouter.get("/filtered", asyncHandler(productController.searchedProducts));
productRouter.get("/edit/:id", asyncHandler(productController.editProduct));
productRouter.post("/update/:id", asyncHandler(productController.updateProduct));
productRouter.get("/add", asyncHandler(productController.addProductGet));
productRouter.post("/add", asyncHandler(productController.addProductPost));
productRouter.post("/delete/:id", asyncHandler(productController.deleteProduct));

export default productRouter;