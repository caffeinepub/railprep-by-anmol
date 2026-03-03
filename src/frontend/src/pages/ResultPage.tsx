import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart2,
  CheckCircle2,
  Clock,
  Eye,
  Medal,
  MinusCircle,
  RotateCcw,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { QuizResult } from "../context/QuizContext";
import { formatTime, useQuiz } from "../context/QuizContext";

function ScoreMeter({ pct }: { pct: number }) {
  const passed = pct >= 40;
  const color =
    pct >= 70
      ? "text-success"
      : pct >= 40
        ? "text-amber-vivid"
        : "text-destructive";
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 120 70"
        className="w-48 h-28"
        role="img"
        aria-label={`Score meter showing ${pct.toFixed(1)}%`}
      >
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="oklch(var(--muted))"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={
            passed ? "oklch(var(--success))" : "oklch(var(--destructive))"
          }
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(Math.min(pct, 100) / 100) * 157} 157`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <div
          className={`text-4xl font-display font-black font-numeric ${color}`}
        >
          {pct.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

function getPerformanceMessage(accuracy: number): {
  message: string;
  color: string;
} {
  if (accuracy >= 85)
    return {
      message: "Excellent! You're exam-ready.",
      color: "text-success",
    };
  if (accuracy >= 70)
    return {
      message: "Very Good! A little more practice.",
      color: "text-primary",
    };
  if (accuracy >= 50)
    return {
      message: "Average. Focus on weak topics.",
      color: "text-amber-600 dark:text-amber-400",
    };
  return {
    message: "Needs Improvement. Practice daily.",
    color: "text-destructive",
  };
}

// Simulate All India Rank from a normal distribution of 100,000 students
function simulateRank(
  finalScore: number,
  totalQuestions: number,
): {
  rank: number;
  percentile: number;
  topPercent: string;
} {
  const mean = totalQuestions * 0.4;
  const std = totalQuestions * 0.15;
  const z = (finalScore - mean) / (std || 1);
  const cdf = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const poly =
      0.31938153 * t -
      0.356563782 * t ** 2 +
      1.781477937 * t ** 3 -
      1.821255978 * t ** 4 +
      1.330274429 * t ** 5;
    const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    const result = 1 - phi * poly;
    return x >= 0 ? result : 1 - result;
  };
  const percentile = Math.min(99.9, Math.max(0.1, cdf(z) * 100));
  const rank = Math.max(1, Math.round((1 - percentile / 100) * 100000) + 1);
  let topPercent = "Bottom 50%";
  if (percentile >= 99) topPercent = "Top 1%";
  else if (percentile >= 95) topPercent = "Top 5%";
  else if (percentile >= 90) topPercent = "Top 10%";
  else if (percentile >= 75) topPercent = "Top 25%";

  return { rank, percentile: Math.round(percentile * 10) / 10, topPercent };
}

// Inner component that always receives a valid result
function ResultContent({ result }: { result: QuizResult }) {
  const navigate = useNavigate();
  const { clearQuiz } = useQuiz();

  const { questions, answers, timeTaken, config } = result;
  const total = questions.length;

  const correct = answers.filter((a) => {
    const q = questions.find((q) => q.question_id === a.questionId);
    return q && a.selectedAnswer === q.correct_answer;
  }).length;

  const wrong = answers.filter((a) => {
    const q = questions.find((q) => q.question_id === a.questionId);
    return q && !!a.selectedAnswer && a.selectedAnswer !== q.correct_answer;
  }).length;

  const skipped = answers.filter((a) => !a.selectedAnswer).length;
  const attempted = correct + wrong;

  const rawScore = result.rawScore ?? correct;
  const negativeDeduction = result.negativeDeduction ?? 0;
  const finalScore = result.finalScore ?? rawScore;
  const accuracy =
    result.accuracy ?? (attempted > 0 ? (correct / attempted) * 100 : 0);

  const scorePct = total > 0 ? (correct / total) * 100 : 0;
  const passed = scorePct >= 40;
  const perf = getPerformanceMessage(accuracy);

  const sectionMap = useMemo(() => {
    const map: Record<
      string,
      { total: number; correct: number; wrong: number; skipped: number }
    > = {};
    for (const q of questions) {
      const sec = q.section || "General";
      if (!map[sec]) map[sec] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      map[sec].total += 1;
      const ans = answers.find((a) => a.questionId === q.question_id);
      if (!ans?.selectedAnswer) {
        map[sec].skipped += 1;
      } else if (ans.selectedAnswer === q.correct_answer) {
        map[sec].correct += 1;
      } else {
        map[sec].wrong += 1;
      }
    }
    return map;
  }, [questions, answers]);

  const sections = Object.entries(sectionMap);

  const airData = useMemo(
    () => simulateRank(finalScore, total),
    [finalScore, total],
  );

  const handleRetry = () => {
    clearQuiz();
    navigate({ to: "/" });
  };

  const modeLabel =
    config.mode === "full_mock"
      ? "Full Mock (100 Qs)"
      : config.mode === "mock_test"
        ? "Mock Test (50 Qs)"
        : "Quick Test (25 Qs)";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-display font-black text-foreground mb-2">
            Test Complete!
          </h1>
          <p className="text-muted-foreground font-body">
            {config.exam} — {modeLabel}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          data-ocid="result.score_card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`bg-card border-2 rounded-3xl p-8 mb-8 text-center ${
            passed
              ? "border-success/30 shadow-xl shadow-success/10"
              : "border-destructive/30 shadow-xl shadow-destructive/10"
          }`}
        >
          <div className="flex justify-center mb-2">
            {passed ? (
              <div className="flex items-center gap-2 text-success">
                <Trophy className="h-6 w-6" />
                <span className="font-display font-bold text-lg">Passed!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <Medal className="h-6 w-6" />
                <span className="font-display font-bold text-lg">
                  Keep Practicing
                </span>
              </div>
            )}
          </div>

          <ScoreMeter pct={accuracy} />

          <p
            className={`font-display font-bold text-sm mt-1 mb-2 ${perf.color}`}
          >
            {perf.message}
          </p>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Accuracy based on attempted questions
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {[
              {
                label: "Total",
                val: total,
                icon: <TrendingUp className="h-4 w-4" />,
                cls: "text-foreground",
              },
              {
                label: "Attempted",
                val: attempted,
                icon: <TrendingUp className="h-4 w-4" />,
                cls: "text-primary",
              },
              {
                label: "Correct",
                val: correct,
                icon: <CheckCircle2 className="h-4 w-4" />,
                cls: "text-success",
              },
              {
                label: "Wrong",
                val: wrong,
                icon: <XCircle className="h-4 w-4" />,
                cls: "text-destructive",
              },
              {
                label: "Skipped",
                val: skipped,
                icon: <MinusCircle className="h-4 w-4" />,
                cls: "text-muted-foreground",
              },
              {
                label: "Time",
                val: formatTime(timeTaken),
                icon: <Clock className="h-4 w-4" />,
                cls: "text-primary",
              },
            ].map(({ label, val, icon, cls }) => (
              <div
                key={label}
                className="bg-muted/40 rounded-xl p-3 text-center"
              >
                <div
                  className={`flex items-center justify-center gap-1 text-xs font-body mb-1 ${cls}`}
                >
                  {icon}
                  {label}
                </div>
                <div
                  className={`font-display font-black text-xl font-numeric ${cls}`}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scoring Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-5 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Score Analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-success/5 border border-success/20 rounded-xl">
              <div className="text-2xl font-display font-black text-success font-numeric">
                +{rawScore.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground font-body mt-1">
                Raw Score
              </div>
            </div>
            <div className="text-center p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <div className="text-2xl font-display font-black text-destructive font-numeric">
                −{negativeDeduction.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground font-body mt-1">
                Negative Marks
              </div>
            </div>
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div
                className={`text-2xl font-display font-black font-numeric ${finalScore >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {finalScore.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground font-body mt-1">
                Final Score
              </div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl">
              <div className="text-2xl font-display font-black text-amber-600 dark:text-amber-400 font-numeric">
                {accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground font-body mt-1">
                Accuracy
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-3 text-center">
            Formula: Final Score = (Correct × 1) − (Wrong × 0.33) − (Skipped ×
            0.10)
          </p>
        </motion.div>

        {/* All India Rank Simulation */}
        <motion.div
          data-ocid="result.air_panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-navy-deep text-white rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-vivid" />
            All India Rank Simulation
            <span className="text-xs text-white/50 font-body font-normal">
              (based on 1,00,000 students)
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-display font-black text-amber-vivid font-numeric">
                #{airData.rank.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs font-body mt-1">
                Estimated Rank
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-amber-vivid font-numeric">
                {airData.percentile}%
              </div>
              <div className="text-white/60 text-xs font-body mt-1">
                Percentile
              </div>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-amber-vivid">
                {airData.topPercent}
              </div>
              <div className="text-white/60 text-xs font-body mt-1">
                Standing
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Breakdown */}
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 mb-8"
          >
            <h2 className="font-display font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Section-wise Performance
            </h2>
            <Table data-ocid="result.section_table">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-display font-bold">
                    Section
                  </TableHead>
                  <TableHead className="font-display font-bold text-center">
                    Qs
                  </TableHead>
                  <TableHead className="font-display font-bold text-center">
                    Correct
                  </TableHead>
                  <TableHead className="font-display font-bold text-center">
                    Wrong
                  </TableHead>
                  <TableHead className="font-display font-bold text-center">
                    Skipped
                  </TableHead>
                  <TableHead className="font-display font-bold text-center">
                    Score
                  </TableHead>
                  <TableHead className="font-display font-bold">
                    Progress
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map(([sec, data]) => {
                  const secScore =
                    data.total > 0 ? (data.correct / data.total) * 100 : 0;
                  return (
                    <TableRow key={sec}>
                      <TableCell className="font-display font-semibold text-sm">
                        {sec}
                      </TableCell>
                      <TableCell className="text-center font-numeric text-sm">
                        {data.total}
                      </TableCell>
                      <TableCell className="text-center font-numeric text-success text-sm">
                        {data.correct}
                      </TableCell>
                      <TableCell className="text-center font-numeric text-destructive text-sm">
                        {data.wrong}
                      </TableCell>
                      <TableCell className="text-center font-numeric text-muted-foreground text-sm">
                        {data.skipped}
                      </TableCell>
                      <TableCell className="text-center font-numeric text-sm">
                        <Badge
                          variant="secondary"
                          className={
                            secScore >= 60
                              ? "bg-success/10 text-success"
                              : secScore >= 40
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                : "bg-destructive/10 text-destructive"
                          }
                        >
                          {secScore.toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Progress value={secScore} className="h-2 w-full" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            data-ocid="result.review_button"
            size="lg"
            onClick={() => navigate({ to: "/review" })}
            className="font-display font-bold gap-2"
          >
            <Eye className="h-5 w-5" />
            Review Answers
          </Button>
          <Button
            data-ocid="result.dashboard_button"
            size="lg"
            variant="outline"
            className="font-display font-bold gap-2"
            asChild
          >
            <Link to="/dashboard">
              <TrendingUp className="h-5 w-5" />
              View Dashboard
            </Link>
          </Button>
          <Button
            data-ocid="result.retry_button"
            size="lg"
            variant="outline"
            onClick={handleRetry}
            className="font-display font-bold gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Take Another Test
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { result } = useQuiz();

  if (!result) {
    navigate({ to: "/" });
    return null;
  }

  return <ResultContent result={result} />;
}
