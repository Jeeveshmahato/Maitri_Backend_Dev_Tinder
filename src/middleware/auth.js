const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Invalid token");
    jwt.verify(token, "shhhhh", async (err, decoded) => {
      if (err) throw new Error("Invalid token");
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("No user, authorization denied");
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message);
  }
};

module.exports = { userAuth };
