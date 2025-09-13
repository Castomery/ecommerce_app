import userModel from "../models/user.model.js"

const addToCart = async (req, res) => {

    try {
        const userId = req.userId;
        const { itemId, size } = req.body;

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(201).json({ success: true, message: "Item added to cart", cartData });

    } catch (error) {
        console.error("Add to Cart Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const updateCart = async (req, res) => {

    try {

        const userId = req.userId;
        const { itemId, size, quantity } = req.body;

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (!cartData[itemId]) {
            return res.status(400).json({ success: false, message: "Item not in cart" });
        }

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(201).json({ success: true, message: "Item added to cart", cartData });

    } catch (error) {
        console.error("Update to Cart Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size } = req.body;

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (cartData[itemId] && cartData[itemId][size]) {
            
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            return res.status(404).json({ success: false, message: "Item or size not found in cart" });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(201).json({ success: true, message: "Item removed from cart", cartData });

    } catch (error) {
        console.error("Delete from Cart Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getUserCart = async (req, res) => {

    try {

        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        res.status(201).json({ success: true, cartData });

    } catch (error) {
        console.error("Get Cart Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }


}

export { addToCart, updateCart, getUserCart, deleteFromCart }