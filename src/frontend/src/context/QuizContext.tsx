import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Question } from "../backend.d";

export type ExamType = "RRB Group D" | "RRB NTPC" | "RRB ALP";
export type QuizMode = "quick_test" | "mock_test" | "full_mock";
export type DifficultyFilter = "" | "Easy" | "Medium" | "Hard";

export interface QuizConfig {
  exam: ExamType;
  mode: QuizMode;
  section: string;
  topic: string;
  difficulty: DifficultyFilter;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | null;
  isSkipped: boolean;
}

export interface QuizResult {
  id: string;
  questions: Question[];
  answers: QuizAnswer[];
  timeTaken: number; // seconds
  config: QuizConfig;
  timestamp: number; // Date.now()
  // Scoring
  rawScore: number;
  negativeDeduction: number;
  finalScore: number;
  accuracy: number; // 0-100
}

interface QuizContextType {
  config: QuizConfig | null;
  setConfig: (config: QuizConfig) => void;
  result: QuizResult | null;
  setResult: (result: QuizResult) => void;
  clearQuiz: () => void;
  testHistory: QuizResult[];
  addToHistory: (result: QuizResult) => void;
  bookmarks: Set<string>;
  toggleBookmark: (questionId: string) => void;
  markForReview: Record<string, boolean>;
  setMarkForReview: (questionId: string, value: boolean) => void;
  clearMarkForReview: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

const HISTORY_KEY = "railprep_history";
const BOOKMARKS_KEY = "railprep_bookmarks";

function loadHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizResult[];
  } catch {
    return [];
  }
}

function saveHistory(history: QuizResult[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-20)));
  } catch {
    // ignore storage errors
  }
}

function loadBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveBookmarks(bookmarks: Set<string>): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  } catch {
    // ignore storage errors
  }
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<QuizConfig | null>(null);
  const [result, setResultState] = useState<QuizResult | null>(null);
  const [testHistory, setTestHistory] = useState<QuizResult[]>(() =>
    loadHistory(),
  );
  const [bookmarks, setBookmarks] = useState<Set<string>>(() =>
    loadBookmarks(),
  );
  const [markForReview, setMarkForReviewState] = useState<
    Record<string, boolean>
  >({});

  const setConfig = useCallback((c: QuizConfig) => setConfigState(c), []);

  const setResult = useCallback((r: QuizResult) => {
    setResultState(r);
  }, []);

  const addToHistory = useCallback((r: QuizResult) => {
    setTestHistory((prev) => {
      const next = [...prev, r].slice(-20);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearQuiz = useCallback(() => {
    setConfigState(null);
    setResultState(null);
    setMarkForReviewState({});
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      saveBookmarks(next);
      return next;
    });
  }, []);

  const setMarkForReview = useCallback((questionId: string, value: boolean) => {
    setMarkForReviewState((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const clearMarkForReview = useCallback(() => {
    setMarkForReviewState({});
  }, []);

  // Persist bookmarks whenever they change
  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  return (
    <QuizContext.Provider
      value={{
        config,
        setConfig,
        result,
        setResult,
        clearQuiz,
        testHistory,
        addToHistory,
        bookmarks,
        toggleBookmark,
        markForReview,
        setMarkForReview,
        clearMarkForReview,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}

// Fisher-Yates shuffle
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getModeConfig(mode: QuizMode): {
  count: bigint;
  timeSeconds: number;
  label: string;
} {
  switch (mode) {
    case "quick_test":
      return { count: 25n, timeSeconds: 1200, label: "Quick Test (25 Qs)" };
    case "mock_test":
      return { count: 50n, timeSeconds: 2400, label: "Mock Test (50 Qs)" };
    case "full_mock":
      return { count: 100n, timeSeconds: 4500, label: "Full Mock (100 Qs)" };
  }
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Score calculation
export function calculateScore(
  questions: import("../backend.d").Question[],
  answers: QuizAnswer[],
): {
  correct: number;
  wrong: number;
  skipped: number;
  rawScore: number;
  negativeDeduction: number;
  finalScore: number;
  accuracy: number;
} {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const answer of answers) {
    if (!answer.selectedAnswer) {
      skipped++;
    } else {
      const q = questions.find((q) => q.question_id === answer.questionId);
      if (q) {
        if (answer.selectedAnswer === q.correct_answer) {
          correct++;
        } else {
          wrong++;
        }
      }
    }
  }

  const rawScore = correct * 1;
  const negativeDeduction =
    Math.round((wrong * 0.33 + skipped * 0.1) * 100) / 100;
  const finalScore = Math.round((rawScore - negativeDeduction) * 100) / 100;
  const attempted = correct + wrong;
  const accuracy =
    attempted > 0 ? Math.round((correct / attempted) * 10000) / 100 : 0;

  return {
    correct,
    wrong,
    skipped,
    rawScore,
    negativeDeduction,
    finalScore,
    accuracy,
  };
}

// Generate anonymous user ID
export function getUserId(): string {
  try {
    let uid = localStorage.getItem("railprep_uid");
    if (!uid) {
      uid = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem("railprep_uid", uid);
    }
    return uid;
  } catch {
    return "user_anonymous";
  }
}
