import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  Lightbulb,
  MinusCircle,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Question } from "../backend.d";
import { useQuiz } from "../context/QuizContext";

type FilterType =
  | "all"
  | "correct"
  | "incorrect"
  | "unattempted"
  | "bookmarked";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

function QuestionReviewCard({
  question,
  userAnswer,
  index,
  isBookmarked,
  onToggleBookmark,
}: {
  question: Question;
  userAnswer: string | null;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}) {
  const isCorrect = userAnswer === question.correct_answer;
  const isWrong = !!userAnswer && !isCorrect;
  const unattempted = !userAnswer;

  const statusBadge = unattempted ? (
    <Badge variant="secondary" className="gap-1 font-body">
      <MinusCircle className="h-3 w-3" /> Skipped
    </Badge>
  ) : isCorrect ? (
    <Badge className="bg-success/10 text-success border-success/30 gap-1 font-body">
      <CheckCircle2 className="h-3 w-3" /> Correct
    </Badge>
  ) : (
    <Badge variant="destructive" className="gap-1 font-body opacity-80">
      <XCircle className="h-3 w-3" /> Incorrect
    </Badge>
  );

  return (
    <div
      data-ocid={`review.question_item.${index}`}
      className={`bg-card border rounded-2xl p-6 ${
        unattempted
          ? "border-border"
          : isCorrect
            ? "border-success/30"
            : "border-destructive/30"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-body text-muted-foreground">
            Q{index}
          </span>
          {statusBadge}
          {question.section && (
            <Badge variant="outline" className="text-xs font-body">
              {question.section}
            </Badge>
          )}
          {question.topic && (
            <span className="text-xs text-muted-foreground font-body">
              {question.topic}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-display font-bold ${
              question.difficulty?.toLowerCase() === "easy"
                ? "badge-easy"
                : question.difficulty?.toLowerCase() === "medium"
                  ? "badge-medium"
                  : question.difficulty?.toLowerCase() === "hard"
                    ? "badge-hard"
                    : ""
            }`}
          >
            {question.difficulty || "Medium"}
          </Badge>
          <button
            type="button"
            data-ocid={`review.bookmark_button.${index}`}
            onClick={() => onToggleBookmark(question.question_id)}
            className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-amber-500" />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Question */}
      <p className="font-body text-foreground text-base leading-relaxed mb-5">
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-2 mb-5">
        {OPTION_KEYS.map((key) => {
          const isCorrectOpt = key === question.correct_answer;
          const isUserOpt = key === userAnswer;
          const isMissed = isCorrectOpt && !isUserOpt && !unattempted;

          let cls = "option-default";
          if (isUserOpt && isCorrect) cls = "option-correct";
          else if (isUserOpt && isWrong) cls = "option-incorrect";
          else if (isMissed) cls = "option-missed";

          return (
            <div
              key={key}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 font-body text-sm transition-none ${cls}`}
            >
              <span
                className={`
                flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-display font-black
                ${
                  isCorrectOpt
                    ? "bg-green-600 text-white"
                    : isUserOpt && isWrong
                      ? "bg-red-500 text-white"
                      : "bg-muted text-muted-foreground"
                }
              `}
              >
                {key}
              </span>
              <span className="leading-relaxed pt-0.5">
                {question.options[key as keyof typeof question.options]}
              </span>
              {isUserOpt && !unattempted && (
                <span className="ml-auto flex-shrink-0 text-xs font-body text-muted-foreground">
                  Your answer
                </span>
              )}
              {isCorrectOpt && (
                <CheckCircle2 className="ml-auto flex-shrink-0 h-4 w-4 text-green-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-display font-bold text-amber-700 dark:text-amber-400 block mb-1">
                Explanation
              </span>
              <p className="text-sm font-body text-amber-800 dark:text-amber-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { result, bookmarks, toggleBookmark } = useQuiz();
  const [activeTab, setActiveTab] = useState<FilterType>("all");

  if (!result) {
    navigate({ to: "/" });
    return null;
  }

  const { questions, answers } = result;

  const answerMap = new Map(
    answers.map((a) => [a.questionId, a.selectedAnswer]),
  );

  const filteredQuestions = questions.filter((q) => {
    const userAns = answerMap.get(q.question_id) ?? null;
    const isCorrect = userAns === q.correct_answer;
    switch (activeTab) {
      case "correct":
        return isCorrect && !!userAns;
      case "incorrect":
        return !!userAns && !isCorrect;
      case "unattempted":
        return !userAns;
      case "bookmarked":
        return bookmarks.has(q.question_id);
      default:
        return true;
    }
  });

  const correctCount = answers.filter((a) => {
    const q = questions.find((q) => q.question_id === a.questionId);
    return q && a.selectedAnswer === q.correct_answer;
  }).length;
  const incorrectCount = answers.filter((a) => {
    const q = questions.find((q) => q.question_id === a.questionId);
    return q && !!a.selectedAnswer && a.selectedAnswer !== q.correct_answer;
  }).length;
  const unattemptedCount = answers.filter((a) => !a.selectedAnswer).length;
  const bookmarkedCount = questions.filter((q) =>
    bookmarks.has(q.question_id),
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            data-ocid="review.back_button"
            variant="ghost"
            onClick={() => navigate({ to: "/result" })}
            className="mb-4 font-body text-muted-foreground gap-2 -ml-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Result
          </Button>
          <h1 className="text-3xl font-display font-black text-foreground mb-1">
            Answer Review
          </h1>
          <p className="text-muted-foreground font-body">
            {result.config.exam} — Review all {questions.length} questions
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterType)}
        >
          <ScrollArea className="w-full">
            <TabsList className="mb-8 grid grid-cols-5 w-full h-auto p-1 rounded-xl min-w-[400px]">
              <TabsTrigger
                data-ocid="review.all_tab"
                value="all"
                className="font-display font-bold text-xs sm:text-sm rounded-lg py-2"
              >
                All ({questions.length})
              </TabsTrigger>
              <TabsTrigger
                data-ocid="review.correct_tab"
                value="correct"
                className="font-display font-bold text-xs sm:text-sm rounded-lg py-2"
              >
                ✓ {correctCount}
              </TabsTrigger>
              <TabsTrigger
                data-ocid="review.incorrect_tab"
                value="incorrect"
                className="font-display font-bold text-xs sm:text-sm rounded-lg py-2"
              >
                ✗ {incorrectCount}
              </TabsTrigger>
              <TabsTrigger
                data-ocid="review.unattempted_tab"
                value="unattempted"
                className="font-display font-bold text-xs sm:text-sm rounded-lg py-2"
              >
                Skip {unattemptedCount}
              </TabsTrigger>
              <TabsTrigger
                data-ocid="review.bookmarked_tab"
                value="bookmarked"
                className="font-display font-bold text-xs sm:text-sm rounded-lg py-2"
              >
                🔖 {bookmarkedCount}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value={activeTab}>
            {filteredQuestions.length === 0 ? (
              <div
                data-ocid="review.empty_state"
                className="text-center py-16 text-muted-foreground font-body"
              >
                <MinusCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-display font-bold">
                  No questions here
                </p>
                <p className="text-sm mt-1">
                  {activeTab === "bookmarked"
                    ? "No bookmarked questions yet."
                    : "Switch to another tab to see questions."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.map((q, i) => (
                  <motion.div
                    key={q.question_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <QuestionReviewCard
                      question={q}
                      userAnswer={answerMap.get(q.question_id) ?? null}
                      index={questions.indexOf(q) + 1}
                      isBookmarked={bookmarks.has(q.question_id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
