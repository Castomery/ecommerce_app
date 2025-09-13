import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";

const currency = 'usd';
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrderCOD = async (req, res) => {

    try {

        const userId = req.userId;
        const { items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(201).json({ status: true, message: "Order created" });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}

const placeOrderStripe = async (req, res) => {

    try {

        const userId = req.userId;
        const { items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.status(201).json({success:true, session_url: session.url});

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}

const verifyStripe = async (req, res) => {

    const { orderId, success, userId} = req.body

    try {
        
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData:{}});
            res.status(201).json({success:true})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.status(201).json({success:false})
        }

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const getAllOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({});

        res.status(201).json({ success: true, orders });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

const getUserOrders = async (req, res) => {

    try {

        const userId = req.userId
        const orders = await orderModel.find({ userId });

        return res.status(201).json({ succes: true, orders });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}

const changeOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body

        await orderModel.findByIdAndUpdate(id, { status });

        res.status(201).json({ succes: true, message: "Status changed" });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}

export { placeOrderCOD, placeOrderStripe, getAllOrders, getUserOrders, changeOrderStatus, verifyStripe }