import { cloudinary } from "../libs/cloudinary.js";

const FOLDER = "event-booking";

// อัปโหลดรูปไป Cloudinary แล้วคืน URL
// ถ้าจะเปลี่ยนไปเก็บที่อื่น (เช่นโฟลเดอร์ uploads/) แก้แค่ฟังก์ชันนี้
export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: "image",
        // ย่อรูปที่ใหญ่เกิน 1600px ตอนเก็บ (ฟอร์แมตเดิมไม่เปลี่ยน)
        transformation: [{ width: 1600, height: 1600, crop: "limit" }],
      },
      (err, result) => {
        if (err) return reject(err);
        // f_auto,q_auto: Cloudinary ส่ง webp/avif ให้ browser ที่รองรับ และบีบอัดให้เหมาะสมตอนโหลด
        resolve(
          cloudinary.url(result.public_id, {
            version: result.version,
            fetch_format: "auto",
            quality: "auto",
            secure: true,
          }),
        );
      },
    );
    stream.end(buffer);
  });
};
