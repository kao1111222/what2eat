# What to Eat — Food Review Community

เว็บรีวิวอาหาร Full-stack ภาษาไทย พัฒนาด้วย HTML, CSS, JavaScript, Node.js, Express, Prisma ORM และ PostgreSQL

## ฟังก์ชันที่เชื่อมต่อ Backend และฐานข้อมูล

- สมัครสมาชิก / เข้าสู่ระบบ ด้วยรหัสผ่านที่ hash ด้วย bcrypt
- โปรไฟล์: ดูข้อมูล แก้ไขชื่อ/แนะนำตัว เปลี่ยนรหัสผ่าน และลบบัญชีโดยยืนยันรหัสผ่าน
- รีวิวอาหาร: สร้าง อ่าน แก้ไข และลบ (เจ้าของรีวิวหรือ admin เท่านั้น)
- อัปโหลดรูป JPG, PNG, WEBP ขนาดไม่เกิน 5MB
- ค้นหารีวิวและเรียงตามล่าสุด/ยอดนิยม
- กดถูกใจและบันทึกรายการโปรด
- แสดงความคิดเห็นและลบความคิดเห็นของตนเอง
- ส่งคำร้องแจ้งปัญหา/ขอความช่วยเหลือ/เสนอแนะจากหน้า Contact และจัดการสถานะใน Admin Dashboard
- API health check สำหรับตรวจการเชื่อมต่อฐานข้อมูล
- ปุ่มลบรีวิว/ความคิดเห็น/บัญชี และออกจากระบบมีขั้นตอนยืนยัน

## โครงสร้างโปรเจกต์

```text
what-to-eat/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── db.js
│   │   ├── middleware/auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── reviews.js
│   │       ├── social.js
│   │       └── contact.js
│   └── uploads/
├── database/schema.sql
├── frontend/
│   ├── css/style.css
│   ├── js/app.js
│   └── *.html
├── .env.example
└── package.json
```

## ความต้องการ

- Node.js 18 หรือใหม่กว่า
- PostgreSQL 15 หรือใหม่กว่า
- npm

## วิธีติดตั้งและรันบน Windows / VS Code

1. เปิดโฟลเดอร์โปรเจกต์ใน VS Code
2. ติดตั้งและเปิด PostgreSQL ในเครื่อง หรือเตรียม PostgreSQL connection URL จากผู้ให้บริการ
3. คัดลอก `.env.example` เป็น `.env` ที่โฟลเดอร์หลักของโปรเจกต์
4. กำหนด `DATABASE_URL` รูปแบบ `postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public` และตั้ง `JWT_SECRET` เป็นค่าสุ่มที่ยาวและคาดเดายาก
5. เปิด Terminal ที่โฟลเดอร์หลักแล้วรัน:

```bash
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm start
```

6. เปิด `http://localhost:3000`
7. ผู้ใช้ส่งคำร้องได้ที่ `/contact.html` โดยไม่จำเป็นต้องเข้าสู่ระบบ และผู้ดูแลตรวจคำร้องได้ที่ `/admin.html`

`backend/prisma/schema.prisma` เป็น schema หลักของฐานข้อมูล และ Prisma Client เป็นช่องทางเดียวที่ Backend ใช้คุยกับ PostgreSQL หากใช้ฐานข้อมูลที่มีข้อมูลอยู่แล้ว ให้สำรองข้อมูลก่อนซิงก์ schema ทุกครั้ง ส่วน `database/schema.sql` เป็น SQL dump เก่า ไม่ใช่ขั้นตอนติดตั้ง เพราะมีคำสั่งลบฐานข้อมูล

ระหว่างพัฒนาให้สร้าง migration ใหม่ด้วย `npm run db:migrate` หรือใช้ `npm run db:push` เฉพาะฐานข้อมูลพัฒนา ห้ามใช้ `db:push` กับฐานข้อมูล production ที่มีข้อมูลสำคัญ

ถ้าฐานข้อมูลมีตารางและข้อมูลจากระบบเดิมอยู่แล้ว ให้สำรองข้อมูลและตรวจสอบ schema ก่อน ห้ามรัน migration เริ่มต้นทับฐานข้อมูลนั้น ให้ mark migration เป็น applied เฉพาะเมื่อยืนยันแล้วว่า schema ตรงกัน: `npx prisma migrate resolve --applied 20261107161500_init` จากนั้นจึงใช้ `npm run db:deploy` สำหรับ migration ถัดไป

## แผนที่และค้นหาร้าน

หน้าเขียนรีวิวไม่มีแผนที่ฝังในเว็บ พิมพ์ชื่อร้านแล้วกด Enter หรือกดปุ่มค้นหาเพื่อเปิด Google Maps ในแท็บใหม่ สามารถกรอกที่ตั้งร้านเพิ่มเติมเพื่อช่วยให้ผลค้นหาเจาะจงขึ้น ไม่ต้องใช้ API key

## ตรวจสอบระบบ

- เปิด `http://localhost:3000/api/health` ต้องได้ `status: ok` และ `database: connected`
- สมัครสมาชิกที่ `/register.html`
- เข้าสู่ระบบที่ `/login.html`
- เขียนรีวิวที่ `/write-review.html`
- โปรไฟล์ที่ `/profile.html`
- รายการโปรดที่ `/favorites.html`
- หน้าผู้ดูแลที่ `/admin.html` (ต้องมีบัญชี role `admin`)

## กำหนดผู้ดูแลระบบ

หลังสมัครสมาชิกแล้ว ใช้ PostgreSQL client รันคำสั่งนี้ โดยแทนที่อีเมลด้วยอีเมลบัญชีของคุณ:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## API หลัก

| Method           | Endpoint                    | รายละเอียด                              |
| ---------------- | --------------------------- | --------------------------------------- |
| POST             | `/api/auth/register`        | สมัครสมาชิก                             |
| POST             | `/api/auth/login`           | เข้าสู่ระบบ                             |
| GET/PATCH/DELETE | `/api/auth/me`              | ดู/แก้ไข/ลบบัญชี                        |
| PATCH            | `/api/auth/password`        | เปลี่ยนรหัสผ่าน                         |
| GET/POST         | `/api/reviews`              | ดู/สร้างรีวิว                           |
| GET/PATCH/DELETE | `/api/reviews/:id`          | ดู/แก้ไข/ลบรีวิว                        |
| GET/POST         | `/api/reviews/:id/comments` | ดู/เพิ่มความคิดเห็น                     |
| POST             | `/api/reviews/:id/like`     | สลับสถานะถูกใจ                          |
| GET              | `/api/favorites`            | รายการโปรดของฉัน                        |
| POST             | `/api/reviews/:id/favorite` | สลับรายการโปรด                          |
| POST             | `/api/contact`              | ส่งข้อความติดต่อ                        |
| GET              | `/api/admin/messages`       | ดูคำร้องจากผู้ใช้ (ผู้ดูแลระบบเท่านั้น) |
| PATCH            | `/api/admin/messages/:id`   | อัปเดตสถานะคำร้อง (ผู้ดูแลระบบเท่านั้น) |
| GET              | `/api/admin/summary`        | สรุปข้อมูลสำหรับ admin                  |
| GET/PATCH        | `/api/admin/messages`       | ดู/อัปเดตข้อความติดต่อ                  |
| GET              | `/api/health`               | ตรวจสุขภาพระบบและ DB                    |

## หมายเหตุด้านความปลอดภัย

- อย่าเผยแพร่ไฟล์ `.env` หรือส่ง JWT_SECRET ให้ผู้อื่น
- ระบบยืนยันก่อนลบเป็นการยืนยันในหน้าเว็บ และ API ตรวจสิทธิ์ซ้ำที่ฝั่ง Server
- การลบบัญชีจะลบข้อมูลที่เชื่อมโยงผ่าน Foreign Key แบบ CASCADE
- ควรเพิ่ม HTTPS, CSRF protection, email verification, backup และระบบจัดการรูปภาพสำหรับการนำขึ้น Production จริง
- Admin Dashboard จำกัดด้วย role ที่เก็บในฐานข้อมูล ห้ามให้ผู้ใช้ทั่วไปแก้ role ผ่านหน้าเว็บ
