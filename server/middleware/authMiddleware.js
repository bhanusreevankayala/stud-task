const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const token =
      authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      "secretkey"
    );

    console.log("DECODED:", decoded);

    req.user = decoded.id;

    next();
  } catch (error) {
    console.log(
      "JWT ERROR:",
      error.message
    );

    return res.status(401).json({
      message: "Token failed",
    });
  }
};

module.exports = protect;