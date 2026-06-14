# EngJoy - Tiếng Anh Vui 🎯

## 📖 Mô tả dự án

**EngJoy** là app học tiếng Anh dành cho trẻ em (4-12 tuổi) và người mới bắt đầu. App giúp người dùng đi từ **chưa biết gì → đọc, viết, nói được cơ bản** thông qua:

- 📚 **Học từ vựng** theo 20 chủ đề với emoji, phát âm, ví dụ song ngữ
- 🎮 **Luyện tập** qua các mini game (nghe-chọn, điền từ, ghép chữ)
- 📖 **Truyện tranh emoji** — đọc truyện song ngữ Anh-Việt, tăng dần độ khó
- 🏆 **Gamification** — XP, streak, badge, daily goal
- 🧠 **Spaced Repetition (SRS)** — ôn tập từ đúng lúc

### Công nghệ
- **Frontend:** Expo SDK 56 + React Native 0.85 + Expo Router
- **Language:** TypeScript strict
- **State:** Zustand
- **Database:** Expo SQLite
- **Platform:** Web trước (mobile sau)

### Kiến trúc thư mục
```
engjoy-app/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout: DB init, onboarding redirect
│   ├── (tabs)/             # Tab screens
│   │   ├── _layout.tsx     # Tab navigator
│   │   ├── index.tsx       # Dashboard
│   │   ├── learn.tsx       # Topics grid
│   │   ├── practice.tsx    # Mini games
│   │   ├── read.tsx        # Story library
│   │   └── profile.tsx     # User stats
│   ├── onboarding.tsx      # Level selection
│   ├── learn/[topicId].tsx # Topic detail + flashcards
│   ├── quiz/[mode].tsx     # Quiz session
│   ├── read/[storyId].tsx  # Story reader
│   └── result.tsx          # Quiz result
├── src/
│   ├── types/index.ts      # Domain types
│   ├── constants/index.ts  # Colors, spacing, XP config
│   ├── db/
│   │   ├── schema.ts       # SQLite schema + init
│   │   ├── seed.ts         # Seed data (vocab, questions, stories)
│   │   └── operations.ts   # DB queries
│   ├── engine/
│   │   └── srs.ts          # Spaced repetition logic
│   ├── stores/
│   │   └── userStore.ts    # Zustand store
│   └── components/         # Reusable UI components
```

---

## 🤝 Quy tắc làm việc

### Vai trò
| Vai trò | Người | Trách nhiệm |
|---|---|---|
| **PM** | @fiaboo (bạn) | Quyết định tính năng, review output, approve |
| **Kỹ sư AI 1** | Codex CLI (OpenAI) | Build screens, components, DB operations |
| **Kỹ sư AI 2** | Claude Code (Anthropic) | Giải quyết bugs phức tạp, architectural review |

### Quy trình

```
PM: "build screen X có tính năng Y"
  └→ Codex: code + test + fix lỗi
      └→ PM: review, báo lỗi nếu có
          └→ Codex: sửa lỗi
              └→ PM: OK → commit
```

### Nguyên tắc

1. **Mỗi lần 1 task nhỏ** — không giao task quá lớn (tránh Codex bị lạc)
2. **TDD / Kiểm tra chéo** — Codex chạy `npx tsc --noEmit` sau mỗi thay đổi
3. **Commit từng phần** — mỗi tính năng hoàn thành = 1 commit
4. **Seed data đủ** — không để placeholder "TODO", phải có nội dung thật
5. **UI Tiếng Việt, nội dung Tiếng Anh** — giao diện cho người Việt, từ vựng cho người học
6. **Web trước** — `npm run web` phải chạy được trước khi làm mobile
7. **Báo cáo ngắn gọn** — PM chỉ cần biết "xong / lỗi gì / cần gì"

### Cách PM giao việc

```
Ví dụ:
PM: "Build màn hình Dashboard: streak, daily goal, continue learning"

→ Codex sẽ:
1. Đọc file types, constants, schema hiện có
2. Tạo app/(tabs)/index.tsx
3. Import đúng types, dùng COLORS từ constants
4. Chạy tsc --noEmit
5. Commit
```

### Khi có lỗi

```
PM: "Màn hình X bị lỗi: <mô tả>"
→ Codex: đọc log, fix, chạy lại
→ PM: kiểm tra lại
```

---

## 🚀 Roadmap

| Phase | Nội dung | Thời gian |
|---|---|---|
| **1** | DB schema + types + constants | ✅ |
| **2** | Layout + Dashboard | ⏳ |
| **3** | Learn + Flashcards | 📅 |
| **4** | Practice + Mini games | 📅 |
| **5** | Story reader (comic) | 📅 |
| **6** | Quiz + Exam mode | 📅 |
| **7** | Profile + Gamification | 📅 |
| **8** | Seed data 400+ từ, 200+ câu, 15 truyện | 📅 |
| **9** | Polish + Deploy web | 📅 |

---

*Cập nhật lần cuối: 14/06/2026*
