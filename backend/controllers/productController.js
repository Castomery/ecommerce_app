import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";

const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let parsedSizes = [];
        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
        } catch {
            return res.status(400).json({ success: false, message: "Invalid sizes format" });
        }

        const files = req.files ? Object.values(req.files).flat() : [];

        const imagesUrl = await Promise.all(
            files.map(async (file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                    return result.secure_url;
                } catch (err) {
                    console.error("Cloudinary upload failed:", err.message);
                    return null;
                }
            })
        );

        const validImages = imagesUrl.filter(Boolean);

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: validImages,
            date: Date.now(),
        }

        const product = new productModel(productData);

        await product.save();

        res.status(201).json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAllProducts = async (req, res) => {

    try {

        const products = await productModel.find({});

        res.status(201).json({ success: true, products })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

const removeProduct = async (req, res) => {

    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);

        res.status(201).json({ success: true, message: "Product deleted" })

    } catch (error) {

        res.status(500).json({ success: false, message: error.message })
    }

}

const getProductInfo = async (req, res) => {

    try {

        const { id } = req.params;

        const productData = await productModel.findById(id);

        res.status(201).json({ success: true, productData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

export { addProduct, getAllProducts, removeProduct, getProductInfo }