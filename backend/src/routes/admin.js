const express = require("express");
const router = express.Router();
const db = require("../db");
const requireAdmin = require("../middleware/adminAuth");

router.use(requireAdmin);

router.get("/users", async (_req, res) => {
  try {
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { id: "desc" },
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return res.status(400).json({ error: "รหัสสมาชิกไม่ถูกต้อง" });
  }
  if (userId === Number(req.user.id)) {
    return res.status(400).json({ error: "ไม่สามารถลบบัญชีของตัวเองได้" });
  }

  try {
    const result = await db.user.deleteMany({ where: { id: userId } });
    if (!result.count) {
      return res.status(404).json({ error: "ไม่พบสมาชิกที่ต้องการลบ" });
    }
    res.json({ message: "ลบสมาชิกออกจากระบบเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบสมาชิก" });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  const reviewId = Number(req.params.id);
  if (!Number.isSafeInteger(reviewId) || reviewId < 1) {
    return res.status(400).json({ error: "รหัสรีวิวไม่ถูกต้อง" });
  }
  try {
    await db.review.deleteMany({ where: { id: reviewId } });
    res.json({ message: "แอดมินลบรีวิวนี้เรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบรีวิว" });
  }
});

router.get("/messages", async (_req, res) => {
  try {
    const messages = await db.contactMessage.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    res.json({
      messages: messages.map(({ createdAt, ...message }) => ({
        ...message,
        created_at: createdAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching contact requests:", err.message);
    res.status(500).json({ error: "ไม่สามารถดึงคำร้องจากผู้ใช้ได้" });
  }
});

router.patch("/messages/:id", async (req, res) => {
  const messageId = Number(req.params.id);
  const status = String(req.body?.status || "");
  if (!Number.isSafeInteger(messageId) || messageId < 1) {
    return res.status(400).json({ error: "รหัสคำร้องไม่ถูกต้อง" });
  }
  if (!["new", "read", "replied", "closed"].includes(status)) {
    return res.status(400).json({ error: "สถานะไม่ถูกต้อง" });
  }

  try {
    const result = await db.contactMessage.updateMany({
      where: { id: messageId },
      data: { status },
    });
    if (!result.count) {
      return res.status(404).json({ error: "ไม่พบคำร้องที่ต้องการอัปเดต" });
    }
    return res.json({ message: "อัปเดตสถานะคำร้องเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error updating contact request:", err.message);
    return res.status(500).json({ error: "ไม่สามารถอัปเดตสถานะคำร้องได้" });
  }
});

module.exports = router;
