import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Medal, Target, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { formatTime, getUserId, useQuiz } from "../context/QuizContext";
import type { QuizResult } from "../context/QuizContext";

type LeaderboardTab = "daily" | "weekly" | "alltime";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  finalScore: number;
  accuracy: number;
  timeTaken: number;
  mode: string;
  timestamp: number;
  isYou: boolean;
}

function filterByTab(history: QuizResult[], tab: LeaderboardTab): QuizResult[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  switch (tab) {
    case "daily":
      return history.filter((r) => now - r.timestamp < dayMs);
    case "weekly":
      return history.filter((r) => now - r.timestamp < 7 * dayMs);
    default:
      return history;
  }
}

function buildLeaderboard(
  history: QuizResult[],
  tab: LeaderboardTab,
  userId: string,
): LeaderboardEntry[] {
  const filtered = filterByTab(history, tab);
  if (filtered.length === 0) return [];

  // Sort by finalScore DESC, accuracy DESC, timeTaken ASC
  const sorted = [...filtered].sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.timeTaken - b.timeTaken;
  });

  return sorted.map((r, i) => ({
    rank: i + 1,
    userId,
    displayName: "You",
    finalScore: r.finalScore,
    accuracy: r.accuracy,
    timeTaken: r.timeTaken,
    mode: r.config.mode,
    timestamp: r.timestamp,
    isYou: true,
  }));
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="text-2xl" title="Gold">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="text-2xl" title="Silver">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="text-2xl" title="Bronze">
        🥉
      </span>
    );
  return (
    <span className="text-sm font-display font-black text-muted-foreground w-8 text-center inline-block">
      #{rank}
    </span>
  );
}

function getRankBg(rank: number): string {
  if (rank === 1)
    return "bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-600/40";
  if (rank === 2)
    return "bg-slate-50 dark:bg-slate-800/30 border-slate-300 dark:border-slate-500/40";
  if (rank === 3)
    return "bg-orange-50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-600/40";
  return "bg-card border-border";
}

function LeaderboardTable({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div
        data-ocid="leaderboard.empty_state"
        className="text-center py-16 text-muted-foreground"
      >
        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p className="font-display font-bold text-lg">No tests yet</p>
        <p className="font-body text-sm mt-1">
          Take a test to appear on the leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={`${entry.timestamp}-${entry.rank}`}
          data-ocid={`leaderboard.item.${i + 1}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${getRankBg(entry.rank)} ${entry.isYou ? "ring-2 ring-primary/30" : ""}`}
        >
          <div className="w-10 flex items-center justify-center flex-shrink-0">
            <MedalIcon rank={entry.rank} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-sm text-foreground">
                {entry.displayName}
              </span>
              {entry.isYou && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  You
                </Badge>
              )}
              <span className="text-xs text-muted-foreground font-body">
                {entry.mode === "full_mock"
                  ? "Full Mock"
                  : entry.mode === "mock_test"
                    ? "Mock Test"
                    : "Quick Test"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-body mt-0.5">
              {new Date(entry.timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-right flex-shrink-0">
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Target className="h-3 w-3" />
                Accuracy
              </div>
              <div className="font-display font-bold text-sm font-numeric">
                {entry.accuracy.toFixed(0)}%
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Clock className="h-3 w-3" />
                Time
              </div>
              <div className="font-display font-bold text-sm font-numeric text-muted-foreground">
                {formatTime(entry.timeTaken)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-body justify-end">
                <Trophy className="h-3 w-3" />
                Score
              </div>
              <div
                className={`font-display font-black text-lg font-numeric ${entry.finalScore >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {entry.finalScore.toFixed(1)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { testHistory } = useQuiz();
  const userId = getUserId();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("alltime");

  const entries = useMemo(
    () => buildLeaderboard(testHistory, activeTab, userId),
    [testHistory, activeTab, userId],
  );

  const bestScore =
    testHistory.length > 0
      ? Math.max(...testHistory.map((r) => r.finalScore))
      : 0;
  const bestAccuracy =
    testHistory.length > 0
      ? Math.max(...testHistory.map((r) => r.accuracy))
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="h-8 w-8 text-amber-vivid" />
            <h1 className="text-3xl md:text-4xl font-display font-black text-foreground">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground font-body">
            Your personal rankings across all tests
          </p>
        </motion.div>

        {/* Personal Best Banner */}
        {testHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-navy-deep text-white rounded-2xl p-6 mb-8"
          >
            <h2 className="font-display font-bold mb-4 flex items-center gap-2 text-amber-vivid">
              <Medal className="h-5 w-5" />
              Your Personal Best
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-display font-black text-amber-vivid font-numeric">
                  {bestScore.toFixed(1)}
                </div>
                <div className="text-white/60 text-xs font-body mt-1">
                  Best Score
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-black text-amber-vivid font-numeric">
                  {bestAccuracy.toFixed(0)}%
                </div>
                <div className="text-white/60 text-xs font-body mt-1">
                  Best Accuracy
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-black text-amber-vivid font-numeric">
                  {testHistory.length}
                </div>
                <div className="text-white/60 text-xs font-body mt-1">
                  Tests Taken
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as LeaderboardTab)}
          >
            <TabsList className="grid grid-cols-3 mb-6 w-full max-w-xs mx-auto">
              <TabsTrigger
                data-ocid="leaderboard.daily_tab"
                value="daily"
                className="font-display font-bold text-sm"
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                data-ocid="leaderboard.weekly_tab"
                value="weekly"
                className="font-display font-bold text-sm"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                data-ocid="leaderboard.alltime_tab"
                value="alltime"
                className="font-display font-bold text-sm"
              >
                All Time
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <LeaderboardTable entries={entries} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button
            data-ocid="leaderboard.start_test_button"
            onClick={() => navigate({ to: "/" })}
            className="font-display font-bold gap-2"
          >
            <Zap className="h-4 w-4" />
            Take a Test to Improve Rank
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
