
import jwt from "jsonwebtoken";


const isAuthenticated = (req, res, next) => {
    try {
        
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        
        const decoded = jwt.verify(token, process.env.secretkey);
        //console.log(decoded);
       
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        
        req.id = decoded.userid;
        next(); 
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(500).json({ message: "Authentication failed" });
    }
};

export default isAuthenticated;
