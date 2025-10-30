import jwt from "jsonwebtoken"; 

const JWT_SECRET = process.env.JWT_SECRET;

const authUser = (req, res, next) => {
 const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: "Không có token" })

  const token = authHeader.split(" ")[1]

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token không hợp lệ" })

    req.userId = decoded.id
    next()
  })
};

export default authUser;