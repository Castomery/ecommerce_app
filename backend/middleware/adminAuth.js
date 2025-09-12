import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {

    try {

        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized" })
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authorized" })
        }

        next()


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default adminAuth;