import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.headers;

    if(!token){
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    try {

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = tokenDecode.id;
        next()

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

export default userAuth;