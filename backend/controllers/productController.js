import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/product.model.js";

const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(images.map(async(image) => {
            let result = await cloudinary.uploader.upload(image.path,{resource_type:'image'});
            return result.secure_url;
        })
    )

        console.log(name, description, price, category, subCategory, sizes, bestseller)
        console.log(imagesUrl);

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true: false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
        }

        const product = new productModel(productData);

        await product.save();

        res.json({success: true, message:"Product Added"});

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const getAllProducts = async (req, res) => {

}

const removeProduct = async (req, res) => {

}

const getProductInfo = async (req, res) => {

}

export { addProduct, getAllProducts, removeProduct, getProductInfo }