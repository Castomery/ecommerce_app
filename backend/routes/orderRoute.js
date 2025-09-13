import express from "express"
import {placeOrderCOD, placeOrderStripe, getAllOrders, getUserOrders, changeOrderStatus, verifyStripe} from "../controllers/orderController.js"
import adminAuth from "../middleware/adminAuth.js"
import userAuth from "../middleware/userAuth.js"

const orderRouter = express.Router()

orderRouter.get("/list", adminAuth, getAllOrders);
orderRouter.put("/status/:id", adminAuth, changeOrderStatus);

orderRouter.post("/cod",userAuth,placeOrderCOD);
orderRouter.post("/stripe",userAuth,placeOrderStripe);

orderRouter.get("/userorders", userAuth, getUserOrders);
orderRouter.post("/verifyStripe", userAuth, verifyStripe )

export default orderRouter;