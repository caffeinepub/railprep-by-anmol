import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  Flame,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuiz } from "../context/QuizContext";

interface BadgeInfo {
  id: string;
  label: string;
  icon: string;
  desc: string;
  earned: boolean;
}

function computeBadges(
  history: ReturnType<typeof useQuiz>["testHistory"],
): BadgeInfo[] {
  const badges: BadgeInfo[] = [
    {
      id: "accuracy_king",
      label: "Accuracy King",
      icon: "🎯",
      desc: "Achieve ≥90% accuracy in any test",
      earned: history.some((r) => r.accuracy >= 90),
    },
    {
      id: "speed_master",
      label: "Speed Master",
      icon: "⚡",
      desc: "Complete 100Q test in < 45 minutes",
      earned: history.some(
        (r) =>
          r.config.mode === "full_mock" &&
          r.timeTaken < 45 * 60 &&
          r.questions.length >= 100,
      ),
    },
    {
      id: "maths_dominator",
      label: "Maths Dominator",
      icon: "🔢",
      desc: "≥85% in Mathematics section",
      earned: history.some((r) => {
        const mathQs = r.questions.filter((q) => q.section === "Mathematics");
        if (mathQs.length === 0) return false;
        const mathCorrect = r.answers.filter((a) => {
          const q = r.questions.find((q) => q.question_id === a.questionId);
          return (
            q?.section === "Mathematics" &&
            a.selectedAnswer === q.correct_answer
          );
        }).length;
        return (mathCorrect / mathQs.length) * 100 >= 85;
      }),
    },
    {
      id: "reasoning_beast",
      label: "Reasoning Beast",
      icon: "🧠",
      desc: "≥85% in Mental Ability section",
      earned: history.some((r) => {
        const qs = r.questions.filter((q) => q.section === "Mental Ability");
        if (qs.length === 0) return false;
        const cor = r.answers.filter((a) => {
          const q = r.questions.find((q) => q.question_id === a.questionId);
          return (
            q?.section === "Mental Ability" &&
            a.selectedAnswer === q.correct_answer
          );
        }).length;
        return (cor / qs.length) * 100 >= 85;
      }),
    },
    {
      id: "science_pro",
      label: "Science Pro",
      icon: "🔬",
      desc: "≥85% in General Science section",
      earned: history.some((r) => {
        const qs = r.questions.filter((q) => q.section === "General Science");
        if (qs.length === 0) return false;
        const cor = r.answers.filter((a) => {
          const q = r.questions.find((q) => q.question_id === a.questionId);
          return (
            q?.section === "General Science" &&
            a.selectedAnswer === q.correct_answer
          );
        }).length;
        return (cor / qs.length) * 100 >= 85;
      }),
    },
    {
      id: "ga_champion",
      label: "GA Champion",
      icon: "🌏",
      desc: "≥85% in General Awareness section",
      earned: history.some((r) => {
        const qs = r.questions.filter((q) => q.section === "General Awareness");
        if (qs.length === 0) return false;
        const cor = r.answers.filter((a) => {
          const q = r.questions.find((q) => q.question_id === a.questionId);
          return (
            q?.section === "General Awareness" &&
            a.selectedAnswer === q.correct_answer
          );
        }).length;
        return (cor / qs.length) * 100 >= 85;
      }),
    },
    {
      id: "tests_50",
      label: "50 Tests Completed",
      icon: "🏆",
      desc: "Complete 50 tests",
      earned: history.length >= 50,
    },
    {
      id: "tests_100",
      label: "100 Tests Completed",
      icon: "🥇",
      desc: "Complete 100 tests",
      earned: history.length >= 100,
    },
  ];
  return badges;
}

function computeStreak(
  history: ReturnType<typeof useQuiz>["testHistory"],
): number {
  if (history.length === 0) return 0;
  const days = new Set(
    history.map((r) => new Date(r.timestamp).toDateString()),
  );
  let streak = 0;
  const now = new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

interface TopicStat {
  topic: string;
  wrong: number;
  correct: number;
  total: number;
}

function computeTopicStats(
  history: ReturnType<typeof useQuiz>["testHistory"],
): TopicStat[] {
  const map: Record<string, TopicStat> = {};
  for (const r of history) {
    for (const q of r.questions) {
      const t = q.topic || q.section || "Unknown";
      if (!map[t]) map[t] = { topic: t, wrong: 0, correct: 0, total: 0 };
      const ans = r.answers.find((a) => a.questionId === q.question_id);
      map[t].total++;
      if (!ans?.selectedAnswer) {
        // skipped
      } else if (ans.selectedAnswer === q.correct_answer) {
        map[t].correct++;
      } else {
        map[t].wrong++;
      }
    }
  }
  return Object.values(map).filter((t) => t.total > 0);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { testHistory } = useQuiz();

  const badges = useMemo(() => computeBadges(testHistory), [testHistory]);
  const streak = useMemo(() => computeStreak(testHistory), [testHistory]);
  const topicStats = useMemo(
    () => computeTopicStats(testHistory),
    [testHistory],
  );

  const earnedBadges = badges.filter((b) => b.earned);

  // Score / Accuracy trend (last 20)
  const trendData = testHistory.slice(-20).map((r, i) => ({
    test: `T${i + 1}`,
    score: r.finalScore,
    accuracy: r.accuracy,
  }));

  // Section-wise performance (average % correct per section)
  const sectionPerf = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const r of testHistory) {
      for (const q of r.questions) {
        const sec = q.section || "Unknown";
        if (!map[sec]) map[sec] = { correct: 0, total: 0 };
        map[sec].total++;
        const ans = r.answers.find((a) => a.questionId === q.question_id);
        if (ans?.selectedAnswer === q.correct_answer) {
          map[sec].correct++;
        }
      }
    }
    return Object.entries(map).map(([section, d]) => ({
      section: section.replace(" ", "\n"),
      pct: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
    }));
  }, [testHistory]);

  // Time analysis
  const timeData = testHistory.slice(-10).map((r, i) => ({
    test: `T${i + 1}`,
    minutes: Math.round(r.timeTaken / 60),
  }));

  // Weakness analysis
  const sortedByWrong = [...topicStats]
    .filter((t) => t.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong);
  const weakestTopics = sortedByWrong.slice(0, 3);
  const strongestTopics = [...topicStats]
    .filter((t) => t.total >= 3)
    .sort((a, b) => b.correct / (b.total || 1) - a.correct / (a.total || 1))
    .slice(0, 2);
  const repeatedMistakes = sortedByWrong
    .filter((t) => t.wrong >= 3)
    .slice(0, 5);

  const chartConfig = {
    score: { label: "Final Score", color: "oklch(var(--chart-1))" },
    accuracy: { label: "Accuracy %", color: "oklch(var(--chart-2))" },
    pct: { label: "Score %", color: "oklch(var(--chart-3))" },
    minutes: { label: "Time (min)", color: "oklch(var(--chart-4))" },
  };

  const hasHistory = testHistory.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-foreground">
                Performance Dashboard
              </h1>
              <p className="text-muted-foreground font-body mt-1">
                Track your RRB exam preparation progress
              </p>
            </div>
            <Button
              data-ocid="dashboard.start_test_button"
              onClick={() => navigate({ to: "/" })}
              className="font-display font-bold gap-2"
            >
              <Zap className="h-4 w-4" />
              Start New Test
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            {
              label: "Tests Taken",
              val: testHistory.length,
              icon: <BookOpen className="h-5 w-5" />,
              color: "text-primary",
            },
            {
              label: "Day Streak",
              val: `${streak}🔥`,
              icon: <Flame className="h-5 w-5" />,
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Best Score",
              val:
                testHistory.length > 0
                  ? `${Math.max(...testHistory.map((r) => r.finalScore)).toFixed(1)}`
                  : "—",
              icon: <Trophy className="h-5 w-5" />,
              color: "text-success",
            },
            {
              label: "Best Accuracy",
              val:
                testHistory.length > 0
                  ? `${Math.max(...testHistory.map((r) => r.accuracy)).toFixed(0)}%`
                  : "—",
              icon: <Target className="h-5 w-5" />,
              color: "text-purple-600",
            },
          ].map(({ label, val, icon, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div
                className={`flex items-center gap-2 mb-2 ${color} text-sm font-body`}
              >
                {icon}
                {label}
              </div>
              <div
                className={`text-3xl font-display font-black font-numeric ${color}`}
              >
                {val}
              </div>
            </div>
          ))}
        </motion.div>

        {!hasHistory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="dashboard.empty_state"
            className="text-center py-24 bg-card border border-border rounded-3xl"
          >
            <TrendingUp className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              No Test History Yet
            </h2>
            <p className="text-muted-foreground font-body mb-6 max-w-sm mx-auto">
              Take your first test to see performance graphs and analytics here.
            </p>
            <Button
              data-ocid="dashboard.first_test_button"
              onClick={() => navigate({ to: "/" })}
              className="font-display font-bold gap-2"
            >
              <Zap className="h-4 w-4" />
              Take Your First Test
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Score & Accuracy Trend */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Score & Accuracy Trend
                </h2>
                {trendData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-48">
                    <LineChart data={trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="oklch(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="oklch(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Accuracy %"
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground font-body text-sm">
                    Not enough data
                  </div>
                )}
              </motion.div>

              {/* Section-wise Performance */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Section Performance
                </h2>
                {sectionPerf.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-48">
                    <BarChart data={sectionPerf}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="section" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="pct"
                        fill="oklch(var(--chart-3))"
                        radius={[4, 4, 0, 0]}
                        name="Score %"
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground font-body text-sm">
                    Not enough data
                  </div>
                )}
              </motion.div>

              {/* Time Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Time Analysis (last 10 tests)
                </h2>
                {timeData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-48">
                    <BarChart data={timeData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="minutes"
                        fill="oklch(var(--chart-4))"
                        radius={[4, 4, 0, 0]}
                        name="Time (min)"
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground font-body text-sm">
                    Not enough data
                  </div>
                )}
              </motion.div>

              {/* AI Weakness Analyzer */}
              <motion.div
                data-ocid="dashboard.weakness_panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI Weakness Analyzer
                </h2>

                {topicStats.length === 0 ? (
                  <p className="text-muted-foreground font-body text-sm">
                    Take more tests to see your weakness analysis.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {weakestTopics.length > 0 && (
                      <div>
                        <p className="text-xs font-display font-bold text-destructive mb-2">
                          ⚠️ Weakest Topics
                        </p>
                        <div className="space-y-1">
                          {weakestTopics.map((t, i) => (
                            <div
                              key={t.topic}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-body text-foreground">
                                {i + 1}. {t.topic}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {t.wrong} wrong
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {strongestTopics.length > 0 && (
                      <div>
                        <p className="text-xs font-display font-bold text-success mb-2">
                          ✅ Strongest Topics
                        </p>
                        <div className="space-y-1">
                          {strongestTopics.map((t) => (
                            <div
                              key={t.topic}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-body text-foreground">
                                {t.topic}
                              </span>
                              <Badge className="text-xs bg-success/10 text-success border-success/30">
                                {Math.round((t.correct / t.total) * 100)}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {repeatedMistakes.length > 0 && (
                      <div>
                        <p className="text-xs font-display font-bold text-warning mb-2">
                          🔁 Repeated Mistakes (3+ times)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {repeatedMistakes.map((t) => (
                            <Badge
                              key={t.topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {t.topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      data-ocid="dashboard.practice_weak_button"
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 font-display font-bold gap-2"
                      asChild
                    >
                      <Link to="/revision">
                        Practice Weak Topics
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 mb-8"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-5 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Badges & Achievements
                <span className="text-xs text-muted-foreground font-body font-normal">
                  ({earnedBadges.length}/{badges.length} earned)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    data-ocid={`dashboard.badge_${badge.id}`}
                    className={`text-center p-4 rounded-xl border-2 transition-all ${
                      badge.earned
                        ? "border-amber-vivid/40 bg-amber-vivid/5"
                        : "border-border bg-muted/20 opacity-40 grayscale"
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div
                      className={`font-display font-bold text-xs mb-1 ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {badge.label}
                    </div>
                    <div className="text-xs text-muted-foreground font-body leading-tight">
                      {badge.desc}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Test History */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recent Test History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-display font-bold text-muted-foreground text-xs">
                        #
                      </th>
                      <th className="text-left py-2 px-3 font-display font-bold text-muted-foreground text-xs">
                        Mode
                      </th>
                      <th className="text-center py-2 px-3 font-display font-bold text-muted-foreground text-xs">
                        Score
                      </th>
                      <th className="text-center py-2 px-3 font-display font-bold text-muted-foreground text-xs">
                        Accuracy
                      </th>
                      <th className="text-center py-2 px-3 font-display font-bold text-muted-foreground text-xs">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...testHistory]
                      .reverse()
                      .slice(0, 10)
                      .map((r, i) => (
                        <tr
                          key={r.id}
                          data-ocid={`dashboard.history_item.${i + 1}`}
                          className="border-b border-border/50 hover:bg-muted/30"
                        >
                          <td className="py-2 px-3 font-numeric text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="py-2 px-3 font-body">
                            <div className="text-xs font-display font-semibold">
                              {r.config.exam}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {r.config.mode}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center font-numeric font-bold">
                            {r.finalScore.toFixed(1)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge
                              variant="secondary"
                              className={
                                r.accuracy >= 70
                                  ? "bg-success/10 text-success text-xs"
                                  : r.accuracy >= 50
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 text-xs"
                                    : "bg-destructive/10 text-destructive text-xs"
                              }
                            >
                              {r.accuracy.toFixed(0)}%
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-center font-numeric text-muted-foreground text-xs">
                            {Math.floor(r.timeTaken / 60)}m
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
