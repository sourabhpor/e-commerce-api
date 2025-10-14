const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ status: false, message: "Admin access only" });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({ status: false, message: "USER access only" });
  }
  next();
};

export default { isAdmin, isUser };
