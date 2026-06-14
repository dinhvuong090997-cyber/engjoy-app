# EngJoy - Tiếng Anh Vui 🎯

## 📖 Mô tả dự án

**EngJoy** là app học tiếng Anh dành cho trẻ em (4-12 tuổi) và người mới bắt đầu. App giúp người dùng đi từ **chưa biết gì → đọc, viết, nói được cơ bản** thông qua:

- 📚 **Học từ vựng** theo 20 chủ đề với emoji, phát âm, ví dụ song ngữ
- 🎮 **Luyện tập** qua các mini game (nghe-chọn, điền từ, ghép chữ)
- 📖 **Truyện tranh emoji** — đọc truyện song ngữ Anh-Việt, tăng dần độ khó (Level 0→5)
- 🏆 **Gamification** — XP, streak, badge, daily goal
- 🧠 **Spaced Repetition (SRS)** — ôn tập từ đúng lúc
- 🧩 **Flashcard** — lật thẻ, đánh dấu đã thuộc/cần ôn

### Công nghệ
- **Frontend:** Expo SDK 56 + React Native 0.85 + Expo Router
- **Language:** TypeScript strict
- **State:** Zustand
- **Database:** Expo SQLite (native) / localStorage (web)
- **Platform:** Web trước (mobile sau)

### Kiến trúc thư mục
```
engjoy-app/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout: DB init, onboarding redirect
│   ├── (tabs)/             # Tab screens
│   │   ├── _layout.tsx     # Tab navigator (Home, Học, Đọc, Cá nhân)
│   │   ├── index.tsx       # Dashboard: streak, daily goal, continue learning
│   │   ├── learn.tsx       # Topics grid (20 chủ đề)
│   │   ├── practice.tsx    # 3 mini games (nghe-chọn, điền chữ, ghép cặp)
│   │   ├── read.tsx        # Story library
│   │   └── profile.tsx     # User stats, XP, achievements, badges
│   ├── onboarding.tsx      # Level selection (0-5) + tên người dùng
│   ├── learn/[topicId].tsx # Topic detail + flashcards (2 tab: từ vựng / flashcard)
│   ├── quiz/[mode].tsx     # Quiz session (quick/topic/review)
│   ├── read/[storyId].tsx  # Story reader (emoji comic panels + comprehension quiz)
│   └── result.tsx          # Quiz result (điểm, câu sai, review)
├── src/
│   ├── types/index.ts      # Domain types (VocabWord, Question, Story, CardProgress...)
│   ├── constants/index.ts  # Colors, spacing, XP config
│   ├── db/
│   │   ├── schema.ts       # SQLite schema + init (universal: web=localStorage, native=SQLite)
│   │   ├── seed.ts         # Seed data (536 vocab, 260 questions, 10 stories)
│   │   └── schema.web.ts   # Web-only localStorage schema
│   ├── engine/
│   │   └── srs.ts          # Spaced repetition logic
│   ├── dashboard.ts        # Dashboard stats builder
│   ├── learn.ts            # Topic progress builder
│   ├── practice.ts         # Mini games logic
│   ├── read.ts             # Story card builder
│   ├── quiz.ts             # Quiz engine
│   ├── profile.ts          # Profile model (XP, achievements)
│   └── components/         # Reusable UI components
```

---

## 🤝 Quy tắc làm việc

### Vai trò
| Vai trò | Người | Trách nhiệm |
|---|---|---|
| **PM + Founder** | @fiaboo | Quyết định tính năng, review output, approve, test, kiếm khách hàng, định hướng sản phẩm |
| **Kỹ sư AI** | Codex CLI + Claude Code | Build screens, components, seed data, fix bugs, tests |
| **Quản lý + Giám sát** | Hermes Agent | Điều phối công việc, gọi Codex/Claude, theo dõi tiến độ, báo cáo PM |

### Kinh nghiệm thực tế
- **Codex CLI:** Phù hợp task nhỏ (1 screen, 1 tính năng). Hay bị stuck với seed data lớn (100+ entries)
- **Claude Code:** Xử lý tốt task lớn nhưng cần tmux + confirm dialog. Hay hỏi "workspace trust" và "bypass permissions"
- **Python gen seed:** Nhanh nhất cho seed data lớn, nhưng dễ lỗi insertion vào file có sẵn

### Quy trình
```
PM: "build screen X có tính năng Y"
  └→ Codex (task nhỏ) hoặc Claude Code (task lớn): code + test + fix lỗi
      └→ PM: review, báo lỗi nếu có
          └→ fix → PM: OK → commit
```

### Nguyên tắc

1. **Mỗi lần 1 task nhỏ** — không giao task quá lớn (tránh Codex bị lạc)
2. **Kiểm tra TypeScript** — chạy `npx tsc --noEmit` sau mỗi thay đổi
3. **Commit từng phần** — mỗi tính năng hoàn thành = 1 commit
4. **Seed data đủ** — không để placeholder "TODO", nội dung thật
5. **UI Tiếng Việt, nội dung Tiếng Anh** — giao diện cho người Việt, từ vựng cho người học
6. **Web trước** — `npm run web` phải chạy được trước khi làm mobile
7. **Khi seed data bị lỗi** — `git checkout HEAD -- src/db/seed.ts` để restore
8. **Báo cáo ngắn gọn** — PM chỉ cần biết "xong / lỗi gì / cần gì"

### Cách PM giao việc cho Claude Code qua tmux
```
1. tmux new-session -d -s claude-work -x 140 -y 40
2. tmux send-keys -t claude-work "cd /path && claude" Enter
3. sleep 4 (đợi Claude load xong)
4. tmux send-keys -t claude-work "Build screen X: ..." Enter
5. Đợi Claude hỏi confirm → tmux send-keys -t claude-work Enter

Theo dõi: tmux capture-pane -t claude-work -p -S -10
Kết thúc: tmux kill-session -t claude-work
```

---

## 🚀 Roadmap

| Phase | Nội dung | Thời gian | Ghi chú |
|---|---|---|---|
| **1** | DB schema + types + constants | ✅ | |
| **2** | Layout + Dashboard + Onboarding | ✅ | |
| **3** | Learn + Flashcards | ✅ | |
| **4** | Practice + Mini games | ✅ | |
| **5** | Story reader (comic) | ✅ | 10 truyện |
| **6** | Quiz + Result | ✅ | 260 câu hỏi |
| **7** | Profile + Gamification | ✅ | |
| **8** | Seed data Levels 0-5 | 🔄 | 536 từ, 260 câu, 10 truyện (Claude Code đang gen thêm) |
| **9** | Polish + Deploy web | 📅 | |

### Kho dữ liệu hiện tại
| Level | Từ vựng | Câu hỏi | Truyện |
|---|---|---|---|
| 0 - Starter | 150 | 54 | 3 |
| 1 - Beginner | 245 | 65 | 3 |
| 2 - Elementary | 75 | 75 | 2 |
| 3 - Intermediate | 24 | 24 | 2 |
| 4 - Upper | 21 | 21 | 0 |
| 5 - Advanced | 21 | 21 | 0 |
| **Tổng** | **536** | **260** | **10** |

---

*Cập nhật lần cuối: 14/06/2026 — Level 2-5 đang được Claude Code bổ sung*
