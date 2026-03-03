import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  Lightbulb,
  Play,
  SkipForward,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Question } from "../backend.d";
import { shuffleArray, useQuiz } from "../context/QuizContext";
import { FALLBACK_QUESTIONS } from "../data/questions";

type RevisionMode = "wrong" | "weak" | "recent" | "bookmarked";

const REVISION_MODES = [
  {
    id: "wrong" as RevisionMode,
    label: "Wrong Questions",
    desc: "Questions you answered incorrectly in past tests",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-destructive",
    bg: "bg-destructive/5 border-destructive/20",
  },
  {
    id: "weak" as RevisionMode,
    label: "Weak Topics",
    desc: "Topics where you score below 60%",
    icon: <Brain className="h-5 w-5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/30",
  },
  {
    id: "recent" as RevisionMode,
    label: "Last 7 Days",
    desc: "Mistakes made in the last week",
    icon: <Calendar className="h-5 w-5" />,
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20",
  },
  {
    id: "bookmarked" as RevisionMode,
    label: "Bookmarked",
    desc: "Questions you bookmarked for later",
    icon: <Bookmark className="h-5 w-5" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-700/30",
  },
];

const COUNTS = [10, 20, 30] as const;

function getQuestionsForMode(
  mode: RevisionMode,
  count: number,
  testHistory: ReturnType<typeof useQuiz>["testHistory"],
  bookmarks: Set<string>,
): Question[] {
  const allFallback = FALLBACK_QUESTIONS;

  if (mode === "bookmarked") {
    const bookmarkedQs = allFallback.filter((q) =>
      bookmarks.has(q.question_id),
    );
    // Also check test history
    const historyQs = testHistory.flatMap((r) =>
      r.questions.filter((q) => bookmarks.has(q.question_id)),
    );
    const combined = dedupeById([...bookmarkedQs, ...historyQs]);
    if (combined.length === 0) return [];
    return shuffleArray(combined).slice(0, count);
  }

  if (mode === "wrong" || mode === "weak" || mode === "recent") {
    const wrongQIds = new Set<string>();
    const weakTopics = new Set<string>();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const r of testHistory) {
      const isRecent = r.timestamp >= sevenDaysAgo;
      for (const ans of r.answers) {
        if (!ans.selectedAnswer) continue;
        const q = r.questions.find((q) => q.question_id === ans.questionId);
        if (!q) continue;
        if (ans.selectedAnswer !== q.correct_answer) {
          if (mode === "wrong") wrongQIds.add(q.question_id);
          if (mode === "weak") weakTopics.add(q.topic || q.section);
          if (mode === "recent" && isRecent) wrongQIds.add(q.question_id);
        }
      }
    }

    if (mode === "weak" && weakTopics.size > 0) {
      const weakQs = allFallback.filter(
        (q) => weakTopics.has(q.topic) || weakTopics.has(q.section),
      );
      if (weakQs.length > 0) {
        return shuffleArray(weakQs).slice(0, count);
      }
    }

    if (wrongQIds.size > 0) {
      // Get original questions from history that were wrong
      const wrongQs = dedupeById(
        testHistory.flatMap((r) =>
          r.questions.filter((q) => wrongQIds.has(q.question_id)),
        ),
      );
      if (wrongQs.length >= count) {
        return shuffleArray(wrongQs).slice(0, count);
      }
      // Fill remaining from fallback
      const filled = [
        ...wrongQs,
        ...shuffleArray(allFallback).slice(0, count - wrongQs.length),
      ];
      return filled.slice(0, count);
    }
  }

  // Default: random from fallback
  return shuffleArray(allFallback).slice(0, count);
}

function dedupeById(questions: Question[]): Question[] {
  const seen = new Set<string>();
  return questions.filter((q) => {
    if (seen.has(q.question_id)) return false;
    seen.add(q.question_id);
    return true;
  });
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export default function RevisionPage() {
  const navigate = useNavigate();
  const { testHistory, bookmarks, toggleBookmark } = useQuiz();

  const [selectedMode, setSelectedMode] = useState<RevisionMode>("wrong");
  const [selectedCount, setSelectedCount] = useState<10 | 20 | 30>(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleStart = () => {
    const qs = getQuestionsForMode(
      selectedMode,
      selectedCount,
      testHistory,
      bookmarks,
    );
    if (qs.length === 0) {
      toast.error("No questions available", {
        description:
          "Take some tests first, or bookmark questions to practice them here.",
      });
      return;
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setRevealed({});
    setStarted(true);
  };

  const handleSelect = (key: string) => {
    if (!currentQ) return;
    if (answers[currentQ.question_id]) return; // can't change answer once selected
    setAnswers((prev) => ({ ...prev, [currentQ.question_id]: key }));
    setRevealed((prev) => ({ ...prev, [currentQ.question_id]: true }));
  };

  const handleReveal = () => {
    if (!currentQ) return;
    setRevealed((prev) => ({ ...prev, [currentQ.question_id]: true }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const currentQ = questions[currentIdx];
  const isAnswered = currentQ ? !!answers[currentQ.question_id] : false;
  const isRevealed = currentQ ? !!revealed[currentQ.question_id] : false;
  const correctCount = questions.filter(
    (q) => answers[q.question_id] === q.correct_answer,
  ).length;
  const attemptedCount = Object.keys(answers).length;

  if (started && questions.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              data-ocid="revision.back_button"
              onClick={() => setStarted(false)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Exit Revision
            </button>
            <Badge variant="secondary" className="font-body">
              {currentIdx + 1} / {questions.length}
            </Badge>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-muted rounded-full mb-6">
            <div
              className="h-1.5 bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-6 text-sm font-body">
            <span className="text-success font-semibold">
              ✓ {correctCount} correct
            </span>
            <span className="text-muted-foreground">
              {attemptedCount} attempted
            </span>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {currentQ?.section && (
                  <Badge variant="outline" className="text-xs font-body">
                    {currentQ.section}
                  </Badge>
                )}
                {currentQ?.topic && (
                  <span className="text-xs text-muted-foreground font-body">
                    {currentQ.topic}
                  </span>
                )}
              </div>
              <button
                type="button"
                data-ocid="revision.bookmark_button"
                onClick={() => currentQ && toggleBookmark(currentQ.question_id)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {currentQ && bookmarks.has(currentQ.question_id) ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-500" />
                ) : (
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            <p className="font-body text-foreground text-base leading-relaxed">
              {currentQ?.question}
            </p>
          </motion.div>

          {/* Options */}
          <div className="space-y-2 mb-6">
            {OPTION_KEYS.map((key) => {
              const optText =
                currentQ?.options[key as keyof typeof currentQ.options] ?? "";
              const isSelected = answers[currentQ?.question_id ?? ""] === key;
              const isCorrect = key === currentQ?.correct_answer;
              const showResult = isRevealed;

              let cls = "option-default";
              if (showResult) {
                if (isCorrect) cls = "option-correct";
                else if (isSelected && !isCorrect) cls = "option-incorrect";
              } else if (isSelected) {
                cls = "option-selected";
              }

              return (
                <button
                  type="button"
                  key={key}
                  data-ocid={`revision.option_${key.toLowerCase()}_button`}
                  onClick={() => handleSelect(key)}
                  disabled={isAnswered}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 font-body transition-all duration-150 disabled:cursor-pointer ${cls}`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-display font-black ${
                      showResult && isCorrect
                        ? "bg-green-600 text-white"
                        : showResult && isSelected && !isCorrect
                          ? "bg-red-500 text-white"
                          : isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {key}
                  </span>
                  <span className="leading-relaxed pt-0.5">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isRevealed && currentQ?.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-display font-bold text-amber-700 dark:text-amber-400 block mb-1">
                    Explanation
                  </span>
                  <p className="text-sm font-body text-amber-800 dark:text-amber-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              data-ocid="revision.prev_button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="font-display font-bold gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            <div className="flex items-center gap-2">
              {!isRevealed && !isAnswered && (
                <Button
                  data-ocid="revision.reveal_button"
                  variant="ghost"
                  onClick={handleReveal}
                  className="font-display font-semibold text-muted-foreground gap-2 text-sm"
                >
                  <Lightbulb className="h-4 w-4" />
                  Show Answer
                </Button>
              )}
              {currentIdx < questions.length - 1 ? (
                <Button
                  data-ocid="revision.next_button"
                  onClick={handleNext}
                  className="font-display font-bold gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  data-ocid="revision.finish_button"
                  onClick={() => {
                    toast.success(
                      `Revision complete! ${correctCount}/${questions.length} correct`,
                    );
                    setStarted(false);
                  }}
                  className="font-display font-bold gap-2 bg-success hover:bg-success/90 text-white"
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            type="button"
            data-ocid="revision.home_back_button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-black text-foreground">
            Smart Revision
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Practice targeted questions based on your weak areas
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-foreground mb-4">
            Revision Mode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVISION_MODES.map((mode) => (
              <button
                type="button"
                key={mode.id}
                data-ocid={`revision.mode_${mode.id}_button`}
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  selectedMode === mode.id
                    ? `${mode.bg} border-opacity-100`
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`flex items-center gap-3 mb-2 ${mode.color}`}>
                  {mode.icon}
                  <h3 className="font-display font-bold text-sm text-foreground">
                    {mode.label}
                  </h3>
                </div>
                <p className="text-muted-foreground text-xs font-body leading-relaxed">
                  {mode.desc}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Count Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-foreground mb-4">
            Number of Questions
          </h2>
          <div className="flex gap-3">
            {COUNTS.map((c) => (
              <button
                type="button"
                key={c}
                data-ocid={`revision.count_${c}_button`}
                onClick={() => setSelectedCount(c)}
                className={`px-6 py-3 rounded-xl border-2 font-display font-bold text-sm transition-all ${
                  selectedCount === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {c} Qs
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <FileQuestion className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-1">
                How Revision Works
              </h3>
              <p className="text-muted-foreground font-body text-xs leading-relaxed">
                Questions are shown one at a time. Select an answer to
                immediately see if you're correct. Use "Show Answer" to reveal
                the correct answer and explanation without answering. No timer —
                take your time to learn.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-end"
        >
          <Button
            data-ocid="revision.start_button"
            size="lg"
            onClick={handleStart}
            className="font-display font-bold text-base px-10 gap-2"
          >
            <Play className="h-5 w-5" />
            Start Revision ({selectedCount} Qs)
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
