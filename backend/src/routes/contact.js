const router = require("express").Router();
const db = require("../db");

const requestTypes = new Set(["แจ้งปัญหา", "ขอความช่วยเหลือ", "เสนอแนะ", "อื่น ๆ"]);

router.post("/", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const subject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const type =
    typeof req.body?.type === "string" && requestTypes.has(req.body.type)
      ? req.body.type
      : "แจ้งปัญหา";

  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 190 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !subject ||
    subject.length > 150 ||
    !message ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ อีเมล หัวข้อ และรายละเอียดให้ถูกต้อง" });
  }

  try {
    await db.contactMessage.create({
      data: { name, email, subject: `${type}: ${subject}`, message },
    });
    return res
      .status(201)
      .json({ message: "ส่งคำร้องถึงผู้ดูแลเรียบร้อยแล้ว ขอบคุณที่แจ้งให้เราทราบ" });
  } catch (error) {
    console.error("Error saving contact request:", error.message);
    return res.status(500).json({ error: "ส่งคำร้องไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" });
  }
});

module.exports = router;
