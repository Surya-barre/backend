import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token
 

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify JWT
    
    req.user = decoded;  // Attach user data to request     
    // console.log(req.user);
    next(); // Proceed to next middleware
   } catch (error) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};

export default verifyToken;
