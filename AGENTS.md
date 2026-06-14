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
| **8** | Seed data Levels 0-5 | ✅ | 1.404 từ, 1.100 câu, 16 truyện |
| **9** | UI/UX Overhaul | ✅ | Coral theme, rounded cards, pill buttons |
| **10** | Đổi level tự do | ✅ | Level selector trên Dashboard |
|| **11** | GitHub Pages deploy | ✅ | Web tại https://dinhvuong090997-cyber.github.io/engjoy-app/ |
|| **12** | Tối ưu Level 4-5 vocab | ✅ | +161 từ mới (Level 4: 311, Level 5: 240) |
|| **13** | Tab Thư Viện — gộp đọc + TTS | ✅ | 5 truyện Aesop + The Paper Airplane |
|| **14** | Fix emoji animals 🐾 → icon riêng | ✅ | 30 từ sửa emoji, 7 từ clear |
|| **15** | Tìm khách hàng đầu tiên | 📅 | Freelance / bán app |

### Kho dữ liệu hiện tại
| Level | Từ vựng | Câu hỏi | Truyện |
|---|---|---|---|
| 0 - Starter | 174 | 54 | 5 (3 lẻ + 2 Làng Sen) |
| 1 - Beginner | 245 | 65 | 5 (3 lẻ + 2 Làng Sen) |
| 2 - Elementary | 300 | 300 | 2 (1 Làng Sen + 1 lẻ) |
| 3 - Intermediate | 279 | 279 | 2 (1 Làng Sen + 1 lẻ) |
| 4 - Upper | 232 | 232 | 1 (Làng Sen) |
| 5 - Advanced | 174 | 174 | 1 (Làng Sen) |
| **Tổng** | **1.404** | **1.100** | **16** |

### Screens & Tính năng
| Screen | Trạng thái | Mô tả |
|---|---|---|
| Dashboard | ✅ | Hero streak card, stats row, level selector, topic carousel |
| Onboarding | ✅ | Chọn level, nhập tên, hoặc bỏ qua |
| Learn | ✅ | Search + 2-column topic grid, pastel cards |
| Practice | ✅ | 3 mini game cards (nghe-chọn, điền, ghép) |
| Read | ✅ | Story library + page flip reader + comprehension quiz |
| Quiz | ✅ | 3 modes (quick/topic/review), result screen |
| Profile | ✅ | Avatar, XP bar, achievements, stats |
| Tab Navigator | ✅ | Coral theme, rounded bar, 5 tabs

---

*Cập nhật lần cuối: 14/06/2026 — Level 2-5 đang được Claude Code bổ sung*
