import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  Clock,
  FileText,
  Layers,
  Play,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type DifficultyFilter,
  type QuizMode,
  getModeConfig,
  useQuiz,
} from "../context/QuizContext";
import { useSections, useTopicsBySection } from "../hooks/useQueries";

const MODES: {
  id: QuizMode;
  label: string;
  desc: string;
  icon: React.ReactNode;
  questions: number;
  time: string;
  ocid: string;
}[] = [
  {
    id: "quick_test",
    label: "Quick Test",
    desc: "25 questions — ideal for daily practice",
    icon: <Zap className="h-6 w-6" />,
    questions: 25,
    time: "20 min",
    ocid: "config.quick_test_button",
  },
  {
    id: "mock_test",
    label: "Mock Test",
    desc: "50 questions — simulates half-mock exam",
    icon: <Layers className="h-6 w-6" />,
    questions: 50,
    time: "40 min",
    ocid: "config.mock_test_button",
  },
  {
    id: "full_mock",
    label: "Full Mock",
    desc: "100 questions — complete RRB exam simulation",
    icon: <FileText className="h-6 w-6" />,
    questions: 100,
    time: "75 min",
    ocid: "config.full_mock_button",
  },
];

const DIFFICULTIES: { value: DifficultyFilter; label: string }[] = [
  { value: "", label: "All Difficulties" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export default function ConfigurePage() {
  const navigate = useNavigate();
  const { config, setConfig } = useQuiz();

  const [selectedMode, setSelectedMode] = useState<QuizMode>(
    config?.mode ?? "quick_test",
  );
  const [selectedSection, setSelectedSection] = useState(config?.section ?? "");
  const [selectedTopic, setSelectedTopic] = useState(config?.topic ?? "");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>(config?.difficulty ?? "");

  const { data: sections = [] } = useSections();
  const { data: topics = [] } = useTopicsBySection(selectedSection);

  // Reset topic when section changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — reset on section change only
  useEffect(() => {
    setSelectedTopic("");
  }, [selectedSection]);

  if (!config) {
    navigate({ to: "/" });
    return null;
  }

  const modeConfig = getModeConfig(selectedMode);
  const canStart = true; // Always can start — fallback questions available

  const handleStart = () => {
    setConfig({
      ...config,
      mode: selectedMode,
      section: selectedSection,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
    });
    navigate({ to: "/quiz" });
  };

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
            data-ocid="config.back_button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-body">
              {config.exam}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-foreground">
            Configure Your Test
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Choose a mode and customise your practice session
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Select Test Mode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map((mode) => (
              <button
                type="button"
                key={mode.id}
                data-ocid={mode.ocid}
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selectedMode === mode.id
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div
                  className={`mb-3 w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {mode.icon}
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-1">
                  {mode.label}
                </h3>
                <p className="text-muted-foreground text-xs font-body mb-3 leading-relaxed">
                  {mode.desc}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    {mode.questions} Qs
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {mode.time}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Section & Topic filter (optional for all modes) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Filter by Section &amp; Topic{" "}
            <span className="text-xs text-muted-foreground font-body font-normal">
              (optional)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-muted/30 rounded-2xl border border-border">
            {/* Section */}
            <div>
              <p className="text-sm font-display font-semibold text-foreground mb-2">
                Section
              </p>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger
                  data-ocid="config.section_select"
                  className="font-body"
                >
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-body">
                    All Sections
                  </SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s} className="font-body">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div>
              <p className="text-sm font-display font-semibold text-foreground mb-2">
                Topic{" "}
                <span className="text-muted-foreground font-body font-normal">
                  (optional)
                </span>
              </p>
              <Select
                value={selectedTopic}
                onValueChange={setSelectedTopic}
                disabled={!selectedSection}
              >
                <SelectTrigger
                  data-ocid="config.topic_select"
                  className="font-body"
                >
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="font-body">
                    All Topics
                  </SelectItem>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t} className="font-body">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4">
            Difficulty Filter
          </h2>
          <div className="flex flex-wrap gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                type="button"
                key={d.value || "all"}
                data-ocid={`config.difficulty_${d.value || "all"}_button`}
                onClick={() => setSelectedDifficulty(d.value)}
                className={`px-4 py-2 rounded-full text-sm font-display font-semibold border-2 transition-all duration-200 ${
                  selectedDifficulty === d.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 mb-8"
        >
          <h3 className="font-display font-bold text-foreground mb-4">
            Test Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Exam", val: config.exam },
              { label: "Mode", val: modeConfig.label },
              { label: "Questions", val: String(modeConfig.count) },
              {
                label: "Time Limit",
                val: `${Math.round(modeConfig.timeSeconds / 60)} min`,
              },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="text-center p-3 bg-muted/30 rounded-xl"
              >
                <div className="text-xs text-muted-foreground font-body mb-1">
                  {label}
                </div>
                <div className="font-display font-bold text-foreground text-sm">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marking Scheme Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 mb-8"
        >
          <p className="text-xs font-display font-bold text-amber-700 dark:text-amber-400 mb-1">
            Marking Scheme
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-body text-amber-800 dark:text-amber-300">
            <span>✅ Correct: +1</span>
            <span>❌ Wrong: −0.33</span>
            <span>⏭ Skipped: −0.10</span>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex justify-end"
        >
          <Button
            data-ocid="config.start_button"
            size="lg"
            disabled={!canStart}
            onClick={handleStart}
            className="font-display font-bold text-base px-10 gap-2"
          >
            <Play className="h-5 w-5" />
            Start Test
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
