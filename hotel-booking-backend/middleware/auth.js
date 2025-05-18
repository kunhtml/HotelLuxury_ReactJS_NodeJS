// Middleware to verify user is authenticated using session
const verifyToken = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.log("Session missing or user not in session:", req.session);
    return res.status(401).json({ message: "Not authenticated, please login" });
  }

  req.user = req.session.user;
  console.log("User authenticated:", req.user.email);
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied, admin privileges required" });
  }
};

module.exports = { verifyToken, isAdmin };
