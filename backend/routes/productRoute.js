import express from "express"
import { addProduct, getAllProducts, removeProduct, getProductInfo } from "../controllers/productController.js"
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post("/add", upload.fields([{name: 'image1', maxCount:1},{name: 'image2', maxCount:1},{name: 'image3', maxCount:1}]),addProduct);
productRouter.delete("/remove/:id", removeProduct);
productRouter.get("/info/:id", getProductInfo);
productRouter.get("/list", getAllProducts);

export default productRouter;