const jwt = require("jsonwebtoken");
const USER = require("../models/USER");

const verifyToken = async (req, resp, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return resp.status(401).json({ error: "Un authorized user" });
    }
    const decoded = jwt.verify(token, "OKOKOKO12345");
    if (!decoded) {
      return resp.status(401).json({ error: "Un authorized user" });
    }
    const loggedUser = await USER.findById(decoded._id);
    req.user = loggedUser;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyToken;
