import express from "express"
import { addProduct, getAllProducts, removeProduct, getProductInfo } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth , upload.array('images',10),addProduct);
productRouter.delete("/remove/:id", adminAuth,removeProduct);
productRouter.get("/info/:id", getProductInfo);
productRouter.get("/list", getAllProducts);

export default productRouter;