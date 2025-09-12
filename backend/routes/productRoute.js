import express from "express"
import { addProduct, getAllProducts, removeProduct, getProductInfo } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth ,upload.fields([{name: 'image1', maxCount:1},{name: 'image2', maxCount:1},{name: 'image3', maxCount:1}]),addProduct);
productRouter.delete("/remove/:id", adminAuth,removeProduct);
productRouter.get("/info/:id", adminAuth,getProductInfo);
productRouter.get("/list", adminAuth,getAllProducts);

export default productRouter;