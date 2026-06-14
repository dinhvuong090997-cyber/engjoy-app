import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildQuizQuestions,
  buildResultModel,
  parseWrongAnswersParam,
} from "./quiz";
import { type Question } from "./types";

const sampleQuestions: Question[] = [
  {
    id: 1,
    content: "What is cat?",
    options: ["con chó", "con mèo", "con chim", "con cá"],
    correct_index: 1,
    type: "mcq",
    topic: "animals",
    level: 0,
    explanation_vi: "Cat nghĩa là con mèo.",
  },
  {
    id: 2,
    content: "What color is red?",
    options: ["đỏ", "xanh", "vàng", "đen"],
    correct_index: 0,
    type: "mcq",
    topic: "colors",
    level: 0,
    explanation_vi: "Red nghĩa là màu đỏ.",
  },
  {
    id: 3,
    content: "What is dog?",
    options: ["con mèo", "con chó", "con gà", "con vịt"],
    correct_index: 1,
    type: "mcq",
    topic: "animals",
    level: 0,
    explanation_vi: "Dog nghĩa là con chó.",
  },
];

test("quick quiz returns at most ten questions", () => {
  const questions = Array.from({ length: 12 }, (_, index) => ({
    ...sampleQuestions[index % sampleQuestions.length],
    id: index + 1,
  }));

  const model = buildQuizQuestions("quick", questions);

  assert.equal(model.mode, "quick");
  assert.equal(model.questions.length, 10);
  assert.equal(model.emptyMessage, "Chưa có câu hỏi nào");
});

test("topic quiz filters questions by topic", () => {
  const model = buildQuizQuestions("topic", sampleQuestions, {
    topic: "animals",
  });

  assert.deepEqual(
    model.questions.map((question) => question.id),
    [1, 3]
  );
});

test("result model marks pass at seventy percent and resolves wrong answers", () => {
  const model = buildResultModel(sampleQuestions, {
    score: 7,
    total: 10,
    wrongAnswers: [{ questionId: 2, selectedIndex: 1 }],
  });

  assert.equal(model.scoreLabel, "7/10 câu đúng");
  assert.equal(model.percentage, 70);
  assert.equal(model.passed, true);
  assert.equal(model.statusTitle, "Đạt rồi!");
  assert.deepEqual(model.wrongAnswers, [
    {
      question: sampleQuestions[1],
      selectedIndex: 1,
      selectedAnswer: "xanh",
      correctAnswer: "đỏ",
    },
  ]);
});

test("wrong answer param parser ignores malformed values", () => {
  assert.deepEqual(parseWrongAnswersParam("not-json"), []);
  assert.deepEqual(
    parseWrongAnswersParam('[{"questionId":1,"selectedIndex":2}]'),
    [{ questionId: 1, selectedIndex: 2 }]
  );
});
