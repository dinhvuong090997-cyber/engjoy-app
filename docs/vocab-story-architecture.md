# EngJoy — Kiến trúc từ vựng & Hệ thống truyện

## 1. File từ vựng tổng quát (`src/data/vocab-master.ts`)

File này liệt kê TOÀN BỘ từ vựng app có — không phân level, chỉ phân chủ đề.
Đây là "từ điển" tham chiếu cho mọi module khác.

### Cấu trúc
```
Chủ đề → Nhóm nhỏ → Danh sách từ {từ, nghĩa, emoji, độ khó tự nhiên 1-5, gợi ý level phù hợp}
```

### Chủ đề (20 topics, khoảng 2000+ từ)
Mỗi chủ đề chia 3 nhóm:
- **Nhóm 1 (Cơ bản):** Từ hàng ngày, dễ học (50-60% tổng số)
- **Nhóm 2 (Mở rộng):** Từ thông dụng, cần ghi nhớ (30%)
- **Nhóm 3 (Nâng cao):** Từ chuyên sâu, ít gặp (10-20%)

### Lợi ích
- Dễ thêm/sửa/xoá từ — không lo conflict level
- Các module khác (học, flashcard, quiz, truyện) đều đọc từ file này
- Dễ thống kê: tổng bao nhiêu từ, thiếu chủ đề nào

## 2. Từ đó được phân bổ vào 6 Level (`src/data/level-mapping.ts`)

Dựa trên độ khó tự nhiên, mỗi từ được gán vào level phù hợp:

| Level | Số từ | Nhóm chính | Mô tả |
|---|---|---|---|
| 0 | ~200 | Cơ bản | Từ 1-2 âm tiết, đồ vật cụ thể, màu sắc, số đếm |
| 1 | ~300 | Cơ bản → Mở rộng | Động từ hàng ngày, tính từ đơn giản |
| 2 | ~400 | Mở rộng | Câu giao tiếp, từ trừu tượng đơn giản |
| 3 | ~400 | Mở rộng → Nâng cao | Từ học thuật cơ bản, cảm xúc phức tạp |
| 4 | ~350 | Nâng cao | Từ chuyên ngành, idioms đơn giản |
| 5 | ~350 | Nâng cao | Từ ít gặp, cấu trúc phức tạp |

**Tổng: ~2000 từ — đủ giao tiếp cơ bản, đọc hiểu truyện ngắn.**

## 3. Hệ thống truyện "Làng Sen" — Vừa thưởng vừa kiểm tra

### 6 phần, kể 1 câu chuyện xuyên suốt

```
Level 0: "Sen Nhỏ" — 6 panel, 1-3 từ/câu → Biết đọc là hiểu được
Level 1: "Làng Quê" — 8 panel, 3-5 từ/câu
Level 2: "Khám Phá" — 10 panel, 5-8 từ/câu
Level 3: "Vượt Núi" — 12 panel, 8-12 từ/câu
Level 4: "Phiêu Lưu" — 14 panel, 12-18 từ/câu
Level 5: "Trở Về" — 16 panel, 15-25 từ/câu
```

### Cơ chế đặc biệt
- **Đọc tự do:** Không yêu cầu phải học hết level mới đọc. Ai cũng đọc được phần 1, người tư duy tốt có thể hiểu phần 5 dù chưa học.
- **Phần thưởng:** Mỗi phần mở ra khi đạt milestones (học X từ / đạt Y XP) → tạo động lực
- **Kiểm tra nhẹ nhàng:** 3-5 câu hỏi cuối truyện, không tính điểm trừ — chỉ tích cực (đúng được sao, sai không sao)
- **Cùng 1 cốt truyện — 6 góc nhìn:** Phần 0 kể đơn giản "Minh ra vườn chơi", phần 5 kể cùng sự kiện đó nhưng sâu hơn "Minh cảm nhận vẻ đẹp làng Sen qua lăng kính tuổi thơ"

### Tích hợp kiểm tra từ vựng
Cuối mỗi phần truyện có:
- **3 câu hỏi đọc hiểu** (như hiện tại)
- **2-3 câu hỏi từ vựng** nhẹ nhàng (từ trong truyện)
- **1 khung "Từ mới trong truyện"** — highlight các từ khó
- Badge "Độc giả" sau khi đọc xong
