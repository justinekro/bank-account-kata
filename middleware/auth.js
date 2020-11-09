const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Please login to access your bank operations" });
    }

    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw { error: "Invalid user ID" };
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: "Invalid request",
    });
  }
};
