import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            res.status(401).json({success: false, message: "User doen't exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){

            const token = createToken(user._id);

            res.status(201).json({success:true, token});
        }else{
            res.status(401).json({success:false, message: "Invalid credentials"})
        }

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}

// Route for user registration
const registerUser = async (req,res) => {
    try {
        
        const {name, email, password} = req.body;

        //check if user already exist
        const exist = await userModel.findOne({email});

        if(exist){
            return res.status(409).json({success:false, message: "User already exist"})
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message: "Email is not valid"})
        }

        if(password.length < 8){
            return res.status(400).json({success:false, message: "Password must have at least 8 characters"})
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPass
        })

        const user = await newUser.save();

        const token = createToken(user._id);

        res.status(201).json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false, message:error.message});
    }
}

// Route for admin login
const adminLogin = async(req,res) => {

    try {
        
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email, role:"admin"}, process.env.JWT_SECRET);

            res.status(201).json({success:true, token});
        }
        else{
            res.status(401).json({success:false, message: "Invalid credentials"});
        }

    } catch (error) {
        res.status(500).json({success:false, message: error.message});
    }

}

export {loginUser, registerUser, adminLogin};