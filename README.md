# Math Gesture Challenge 🎮

Một trò chơi học Toán thú vị dành cho học sinh tiểu học, sử dụng nhận diện cử chỉ tay để trả lời câu hỏi.

## ✨ Tính năng
- **Nhận diện cử chỉ tay:** Sử dụng MediaPipe Hands để điều khiển game mà không cần chuột/bàn phím.
- **Giao diện thân thiện:** Màu sắc tươi sáng, font chữ dễ đọc, hiệu ứng sinh động.
- **Hệ thống câu hỏi đa dạng:** 3 cấp độ (Dễ, Trung bình, Khó).
- **Bảng vinh danh:** Lưu trữ top 10 học sinh điểm cao nhất.
- **Trang quản trị:** Giáo viên có thể thêm/sửa/xóa câu hỏi và quản lý bảng điểm.

## 🖐️ Quy ước cử chỉ
- **Nắm tay (Fist):** Chọn đáp án **A**
- **1 Ngón tay (Index):** Chọn đáp án **B**
- **2 Ngón tay (Victory):** Chọn đáp án **C**
- **3+ Ngón tay (Open Hand):** Chọn đáp án **D**
*Giữ cử chỉ trong khoảng 1.5 giây để xác nhận lựa chọn.*

## 🚀 Cài đặt và Chạy
1. Cài đặt dependencies:
   ```bash
   npm install
   ```
2. Chạy ứng dụng ở chế độ phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại: `http://localhost:3000`

## 👩‍🏫 Trang quản trị
Truy cập đường dẫn `/admin` để quản lý câu hỏi và bảng điểm.

## 🛠️ Công nghệ sử dụng
- **Vite + React**
- **Tailwind CSS** (Styling)
- **Motion** (Animations)
- **MediaPipe Hands** (Hand Tracking)
- **Lucide React** (Icons)
- **Canvas Confetti** (Effects)
