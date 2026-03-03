import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  Grid3X3,
  RefreshCw,
  Send,
  SkipForward,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Question } from "../backend.d";
import {
  calculateScore,
  formatTime,
  getModeConfig,
  shuffleArray,
  useQuiz,
} from "../context/QuizContext";
import { useQuestions } from "../hooks/useQueries";

type AnswerMap = Record<string, string | null>;
type SkipMap = Record<string, boolean>;

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

function getDifficultyStyle(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-easy";
    case "medium":
      return "badge-medium";
    case "hard":
      return "badge-hard";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function Timer({ seconds, total }: { seconds: number; total: number }) {
  const safe = Math.max(0, seconds);
  const pct = total > 0 ? safe / total : 1;
  const style =
    pct < 0.1 ? "timer-danger" : pct < 0.2 ? "timer-warning" : "timer-normal";

  return (
    <div
      data-ocid="quiz.timer_panel"
      className={`flex items-center gap-2 font-display font-black text-xl font-numeric ${style}`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        role="img"
        aria-label="Timer"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {formatTime(safe)}
    </div>
  );
}

function PalettePanel({
  questions,
  currentIdx,
  answers,
  skips,
  markedForReview,
  onJump,
}: {
  questions: Question[];
  currentIdx: number;
  answers: AnswerMap;
  skips: SkipMap;
  markedForReview: Record<string, boolean>;
  onJump: (idx: number) => void;
}) {
  return (
    <div data-ocid="quiz.palette_panel" className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs font-body">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-primary inline-block" />
          Answered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-warning inline-block" />
          Skipped
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-purple-500 inline-block" />
          Review
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-muted border border-border inline-block" />
          Not done
        </span>
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.question_id];
          const isSkipped = skips[q.question_id];
          const isReview = markedForReview[q.question_id];
          const isCurrent = i === currentIdx;
          let cls = "palette-unattempted";
          if (isReview) cls = "bg-purple-500 text-white";
          else if (isAnswered) cls = "palette-answered";
          else if (isSkipped) cls = "palette-skipped";

          return (
            <button
              type="button"
              key={q.question_id}
              onClick={() => onJump(i)}
              className={`
                w-7 h-7 text-xs font-display font-bold rounded-md transition-all
                ${cls}
                ${isCurrent ? "ring-2 ring-ring ring-offset-1" : ""}
              `}
              title={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    config,
    setResult,
    addToHistory,
    bookmarks,
    toggleBookmark,
    markForReview: reviewMap,
    setMarkForReview,
    clearMarkForReview,
  } = useQuiz();

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [skips, setSkips] = useState<SkipMap>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submittedRef = useRef(false);
  const startedAt = useRef<number>(Date.now());

  const modeConfig = config ? getModeConfig(config.mode) : null;

  const {
    data: rawQuestions,
    isLoading,
    error,
    usedFallback,
  } = useQuestions({
    exam: config?.exam ?? "",
    section: config?.section ?? "",
    topic: config?.topic ?? "",
    count: modeConfig?.count ?? 25n,
    difficulty: config?.difficulty ?? "",
    enabled: !!config,
  });

  // Shuffle and set questions once loaded
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only react to rawQuestions
  useEffect(() => {
    if (rawQuestions.length > 0 && !started) {
      const shuffled = shuffleArray(rawQuestions).map((q) => {
        // Shuffle options
        const keys = ["A", "B", "C", "D"] as const;
        const shuffledKeys = shuffleArray([...keys]);
        const newOptions: Record<string, string> = {};
        const oldOptions = q.options;
        let newCorrect = q.correct_answer;

        shuffledKeys.forEach((oldKey, newIdx) => {
          const newKey = keys[newIdx];
          newOptions[newKey] = oldOptions[oldKey as keyof typeof oldOptions];
          if (oldKey === q.correct_answer) {
            newCorrect = newKey;
          }
        });

        return {
          ...q,
          options: newOptions as { A: string; B: string; C: string; D: string },
          correct_answer: newCorrect,
        };
      });

      setQuizQuestions(shuffled);
      const t = modeConfig?.timeSeconds ?? 1200;
      setTimeLeft(t);
      setTotalTime(t);
      setStarted(true);
      startedAt.current = Date.now();

      if (usedFallback) {
        toast.info("Loaded backup questions.", {
          description:
            "Questions loaded from local question bank. All topics covered.",
        });
      }
    }
  }, [rawQuestions]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && started && !submittedRef.current) {
        toast.warning("Warning: Tab switching detected!", {
          description: "Switching tabs during exam may be flagged.",
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [started]);

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);

    if (!config) return;

    const timeTaken = Math.floor((Date.now() - startedAt.current) / 1000);

    const finalAnswers = quizQuestions.map((q) => ({
      questionId: q.question_id,
      selectedAnswer: answers[q.question_id] ?? null,
      isSkipped: skips[q.question_id] ?? false,
    }));

    const scoreData = calculateScore(quizQuestions, finalAnswers);

    const result = {
      id: `result_${Date.now()}`,
      questions: quizQuestions,
      answers: finalAnswers,
      timeTaken,
      config,
      timestamp: Date.now(),
      rawScore: scoreData.rawScore,
      negativeDeduction: scoreData.negativeDeduction,
      finalScore: scoreData.finalScore,
      accuracy: scoreData.accuracy,
    };

    setResult(result);
    addToHistory(result);
    clearMarkForReview();
    navigate({ to: "/result" });
  }, [
    config,
    quizQuestions,
    answers,
    skips,
    navigate,
    setResult,
    addToHistory,
    clearMarkForReview,
  ]);

  // Countdown timer — starts only when started=true
  // biome-ignore lint/correctness/useExhaustiveDependencies: handleSubmit is stable
  useEffect(() => {
    if (!started || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 1);
        if (next === 0) {
          clearInterval(interval);
          setTimeout(() => handleSubmit(), 100);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, submitted]);

  if (!config) {
    navigate({ to: "/" });
    return null;
  }

  // Loading state — show until questions are ready
  if (isLoading || (!started && rawQuestions.length === 0)) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="quiz.loading_state"
      >
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="font-display font-bold text-lg text-foreground">
            Loading Questions...
          </p>
          <p className="text-muted-foreground font-body text-sm">
            Preparing your {getModeConfig(config.mode).label}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && rawQuestions.length === 0 && !isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="quiz.error_state"
      >
        <div className="text-center p-8 max-w-sm">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl mb-2">
            Unable to Load Questions
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            Unable to load questions. Please refresh.
          </p>
          <Button
            data-ocid="quiz.refresh_button"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Never render exam if no questions
  if (quizQuestions.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="quiz.loading_state"
      >
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="font-display font-bold text-lg text-foreground">
            Preparing Questions...
          </p>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentIdx];
  const progress =
    quizQuestions.length > 0
      ? ((currentIdx + 1) / quizQuestions.length) * 100
      : 0;

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const skippedCount = Object.values(skips).filter(Boolean).length;
  const isBookmarked = bookmarks.has(currentQ?.question_id ?? "");
  const isMarkedForReview = reviewMap[currentQ?.question_id ?? ""];

  const handleSelectAnswer = (key: string) => {
    if (!currentQ || submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ.question_id]: key }));
    setSkips((prev) => ({ ...prev, [currentQ.question_id]: false }));
  };

  const handleSkip = () => {
    if (!currentQ || submitted) return;
    setSkips((prev) => ({ ...prev, [currentQ.question_id]: true }));
    if (currentIdx < quizQuestions.length - 1) setCurrentIdx((i) => i + 1);
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) setCurrentIdx((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    const current = reviewMap[currentQ.question_id];
    setMarkForReview(currentQ.question_id, !current);
    toast(!current ? "Marked for review" : "Review mark removed", {
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-sm text-foreground hidden sm:block">
                {config.exam} — {getModeConfig(config.mode).label}
              </span>
              <Badge
                data-ocid="quiz.question_counter"
                variant="secondary"
                className="font-body text-xs"
              >
                Q {currentIdx + 1} / {quizQuestions.length}
              </Badge>
            </div>

            <div className="flex-1 max-w-xs hidden sm:block">
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center gap-3">
              <Timer seconds={timeLeft} total={totalTime} />

              <button
                type="button"
                data-ocid="quiz.palette_toggle"
                onClick={() => setShowPalette(!showPalette)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle question palette"
              >
                <Grid3X3 className="h-5 w-5 text-muted-foreground" />
              </button>

              <AlertDialog
                open={submitDialogOpen}
                onOpenChange={setSubmitDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    data-ocid="quiz.submit_button"
                    size="sm"
                    variant="destructive"
                    disabled={submitted}
                    className="font-display font-bold gap-1.5"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Submit</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="quiz.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display font-black">
                      Submit Test?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-body">
                      You have answered <strong>{answeredCount}</strong> of{" "}
                      <strong>{quizQuestions.length}</strong> questions.
                      {skippedCount > 0 &&
                        ` ${skippedCount} question(s) are skipped.`}{" "}
                      {quizQuestions.length - answeredCount - skippedCount}{" "}
                      unattempted. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <button
                      type="button"
                      data-ocid="quiz.cancel_button"
                      onClick={() => setSubmitDialogOpen(false)}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-display font-semibold hover:bg-muted transition-colors"
                    >
                      Continue Test
                    </button>
                    <Button
                      data-ocid="quiz.confirm_button"
                      variant="destructive"
                      disabled={submitted}
                      onClick={() => {
                        setSubmitDialogOpen(false);
                        handleSubmit();
                      }}
                      className="font-display font-bold"
                    >
                      Yes, Submit
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden mt-2">
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ─── Main Question Area ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question Card */}
                <div
                  data-ocid="quiz.question_card"
                  className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-body text-muted-foreground font-semibold">
                        Question {currentIdx + 1} of {quizQuestions.length}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-display font-bold ${getDifficultyStyle(currentQ.difficulty)}`}
                      >
                        {currentQ.difficulty || "Medium"}
                      </span>
                      {currentQ.section && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-body">
                          {currentQ.section}
                        </span>
                      )}
                      {currentQ.topic && (
                        <span className="text-xs text-muted-foreground font-body">
                          {currentQ.topic}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid="quiz.mark_review_button"
                        onClick={handleMarkForReview}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-display font-semibold border transition-colors ${
                          isMarkedForReview
                            ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                        title="Mark for Review"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {isMarkedForReview ? "Marked" : "Review"}
                        </span>
                      </button>
                      <button
                        type="button"
                        data-ocid="quiz.bookmark_button"
                        onClick={() =>
                          toggleBookmark(currentQ?.question_id ?? "")
                        }
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-base md:text-lg font-body text-foreground leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {OPTION_KEYS.map((key) => {
                    const isSelected = answers[currentQ.question_id] === key;
                    const ocidMap: Record<string, string> = {
                      A: "quiz.option_a_button",
                      B: "quiz.option_b_button",
                      C: "quiz.option_c_button",
                      D: "quiz.option_d_button",
                    };
                    return (
                      <button
                        type="button"
                        key={key}
                        data-ocid={ocidMap[key]}
                        onClick={() => handleSelectAnswer(key)}
                        disabled={submitted}
                        className={`w-full text-left flex items-start gap-4 p-4 md:p-5 rounded-xl border-2 font-body transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                          isSelected ? "option-selected" : "option-default"
                        }`}
                      >
                        <span
                          className={`
                          flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-display font-black
                          ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                        >
                          {key}
                        </span>
                        <span className="leading-relaxed pt-0.5">
                          {
                            currentQ.options[
                              key as keyof typeof currentQ.options
                            ]
                          }
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    data-ocid="quiz.prev_button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="font-display font-bold gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <Button
                    data-ocid="quiz.skip_button"
                    variant="ghost"
                    onClick={handleSkip}
                    disabled={submitted}
                    className="font-display font-semibold text-muted-foreground gap-2"
                  >
                    Skip
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {currentIdx < quizQuestions.length - 1 ? (
                    <Button
                      data-ocid="quiz.next_button"
                      onClick={handleNext}
                      className="font-display font-bold gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      data-ocid="quiz.next_button"
                      variant="default"
                      disabled={submitted}
                      onClick={() => setSubmitDialogOpen(true)}
                      className="font-display font-bold gap-2 bg-success hover:bg-success/90 text-white"
                    >
                      Submit Test
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Palette Sidebar (desktop) ───────────────────────── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm text-foreground mb-4">
                Question Palette
              </h3>
              <ScrollArea className="max-h-96">
                <PalettePanel
                  questions={quizQuestions}
                  currentIdx={currentIdx}
                  answers={answers}
                  skips={skips}
                  markedForReview={reviewMap}
                  onJump={setCurrentIdx}
                />
              </ScrollArea>
              <div className="mt-4 pt-4 border-t border-border text-xs font-body text-muted-foreground grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-display font-bold text-foreground text-base">
                    {answeredCount}
                  </div>
                  <div>Answered</div>
                </div>
                <div>
                  <div className="font-display font-bold text-foreground text-base">
                    {skippedCount}
                  </div>
                  <div>Skipped</div>
                </div>
                <div>
                  <div className="font-display font-bold text-foreground text-base">
                    {quizQuestions.length - answeredCount - skippedCount}
                  </div>
                  <div>Pending</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Mobile Palette Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {showPalette && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowPalette(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl p-6 lg:hidden max-h-[70vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">
                  Question Palette
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPalette(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <PalettePanel
                questions={quizQuestions}
                currentIdx={currentIdx}
                answers={answers}
                skips={skips}
                markedForReview={reviewMap}
                onJump={(i) => {
                  setCurrentIdx(i);
                  setShowPalette(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
