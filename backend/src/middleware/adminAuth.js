const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function requireAdmin(req, res, next) {
  // 1. ดึง Token จาก Header 'Authorization'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" });
  }

  // 2. ตรวจสอบความถูกต้องของ Token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    // 3. ตรวจสอบสิทธิ์ว่าเป็น Admin หรือไม่
    if (user.role !== "admin") {
      return res.status(403).json({ error: "สิทธิ์ไม่ถูกต้อง (สำหรับผู้ดูแลระบบเท่านั้น)" });
    }

    // ผ่านการตรวจ นำข้อมูล user ฝากไว้ใน req เพื่อใช้งานต่อ
    req.user = user;
    next();
  });
}

module.exports = requireAdmin;
