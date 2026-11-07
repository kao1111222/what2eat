const nodemailer = require('nodemailer');

// ตั้งค่า Transporter (ตัวอย่างนี้ใช้ Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com', // อีเมลฝั่งผู้ส่ง (ของคุณ)
    pass: 'YOUR_APP_PASSWORD'     // App Password 16 หลักจาก Google Account
  }
});

/**
 * ฟังก์ชันส่งอีเมลต้อนรับการสมัครสมาชิก
 * @param {string} toEmail - อีเมลของผู้สมัคร
 * @param {string} name - ชื่อผู้สมัคร
 */
const sendWelcomeEmail = async (toEmail, name) => {
  const mailOptions = {
    from: '"What to Eat Community" <YOUR_EMAIL@gmail.com>',
    to: toEmail,
    subject: '🎉 ยินดีต้อนรับสู่ What to Eat! สมัครสมาชิกสำเร็จเรียบร้อย',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ef4444;">ยินดีต้อนรับคุณ ${name}! ✽</h2>
        <p>ขอบคุณที่ร่วมเป็นส่วนหนึ่งของสมาคมคนรักอาหารกับเรา <strong>What to Eat</strong></p>
        <p>คุณสามารถเริ่มสำรวจรีวิวร้านเด็ด หรือแบ่งปันความอร่อยให้กับเพื่อนๆ ได้ทันทีที่หน้าเว็บครับ</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">หากคุณไม่ได้ทำการสมัครสมาชิก กรุณามองข้ามอีเมลฉบับนี้</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`ส่งอีเมลแจ้งเตือนการสมัครสำเร็จไปยัง: ${toEmail}`);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งอีเมล:', error);
  }
};

module.exports = { sendWelcomeEmail };