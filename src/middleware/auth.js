const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const userAuth = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided, authorization denied" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ error: "No user found, authorization denied" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { userAuth };
