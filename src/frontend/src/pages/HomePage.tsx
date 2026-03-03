import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart2,
  BookOpen,
  ChevronRight,
  Target,
  Train,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { type ExamType, useQuiz } from "../context/QuizContext";

const EXAM_TYPES: {
  id: ExamType;
  label: string;
  desc: string;
  color: string;
  posts: string;
  icon: string;
}[] = [
  {
    id: "RRB Group D",
    label: "RRB Group D",
    desc: "Track Maintainer, Helper, Gateman & other Level-1 posts",
    color: "from-blue-600 to-blue-800",
    posts: "103,769 posts",
    icon: "🛤️",
  },
  {
    id: "RRB NTPC",
    label: "RRB NTPC",
    desc: "Junior Clerk, Station Master, Goods Guard & Graduate posts",
    color: "from-indigo-600 to-purple-800",
    posts: "11,558 posts",
    icon: "🎓",
  },
  {
    id: "RRB ALP",
    label: "RRB ALP",
    desc: "Assistant Loco Pilot & Technician posts",
    color: "from-cyan-600 to-blue-700",
    posts: "5,696 posts",
    icon: "🚂",
  },
];

const FEATURES = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "2025 Syllabus",
    desc: "Fully updated question bank covering RRB 2025 pattern",
    link: null,
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Smart Revision",
    desc: "Practice wrong & weak topic questions",
    link: "/revision",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "AI Weakness Analyzer",
    desc: "Track weak topics & get personalized insights",
    link: "/dashboard",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Performance Dashboard",
    desc: "Detailed score trends and section analysis",
    link: "/dashboard",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Leaderboard",
    desc: "Compete with other students nationally",
    link: "/leaderboard",
  },
  {
    icon: <BarChart2 className="h-5 w-5" />,
    title: "All India Rank",
    desc: "Simulate your rank among 1 lakh students",
    link: null,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { setConfig } = useQuiz();

  const handleSelectExam = (exam: ExamType) => {
    setConfig({
      exam,
      mode: "quick_test",
      section: "",
      topic: "",
      difficulty: "",
    });
    navigate({ to: "/configure" });
  };

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-deep">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-railway.dim_1400x600.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-navy-deep" />
        </div>

        {/* Track decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-vivid/30 z-10" />
        <div className="absolute bottom-1.5 left-0 right-0 h-px bg-amber-vivid/15 z-10" />

        <div className="relative z-10 container max-w-6xl mx-auto px-4 py-24 md:py-36">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-amber-vivid/20 text-amber-vivid border-amber-vivid/30 font-body text-xs tracking-widest uppercase px-4 py-1.5">
                India's Premier RRB Exam Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-4"
            >
              Crack Your RRB Exam
              <span className="block text-amber-vivid">
                with Smart Practice
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/70 font-body mb-10 max-w-xl"
            >
              Comprehensive MCQ test engine with real RRB 2025 syllabus. Full
              mocks, sectional tests, and speed drills — everything you need.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 items-center"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl font-display font-black text-amber-vivid font-numeric">
                  100,000+
                </span>
                <span className="text-white/60 font-body text-sm">
                  Questions Available
                </span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-display font-black text-amber-vivid">
                  3
                </span>
                <span className="text-white/60 font-body text-sm">
                  Exam Types
                </span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-display font-black text-amber-vivid">
                  4
                </span>
                <span className="text-white/60 font-body text-sm">
                  Sections
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Exam Cards ───────────────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3">
            Choose Your Exam
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Select the exam you are preparing for
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {EXAM_TYPES.map((exam, i) => {
            const ocidMap: Record<string, string> = {
              "RRB Group D": "home.group_d_button",
              "RRB NTPC": "home.ntpc_button",
              "RRB ALP": "home.alp_button",
            };
            return (
              <motion.div key={exam.id} variants={itemVariants} custom={i}>
                <button
                  type="button"
                  data-ocid={ocidMap[exam.id]}
                  onClick={() => handleSelectExam(exam.id)}
                  className="group w-full text-left rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div
                    className={`bg-gradient-to-br ${exam.color} p-8 relative overflow-hidden`}
                  >
                    <div className="absolute top-3 right-3 text-4xl opacity-80">
                      {exam.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
                    <div className="absolute bottom-1.5 left-0 right-0 h-px bg-white/10" />
                    <span className="text-4xl font-display font-black text-white/20 absolute bottom-2 right-4 select-none">
                      {i + 1}
                    </span>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs mb-4">
                      {exam.posts}
                    </Badge>
                    <h3 className="text-2xl font-display font-black text-white">
                      {exam.label}
                    </h3>
                  </div>

                  <div className="p-5">
                    <p className="text-muted-foreground font-body text-sm mb-4 leading-relaxed">
                      {exam.desc}
                    </p>
                    <div className="flex items-center gap-1 text-primary font-display font-semibold text-sm group-hover:gap-2 transition-all">
                      Start Preparing
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section className="bg-muted/50 border-y border-border py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground mb-2">
              Everything You Need to Crack RRB
            </h2>
            <p className="text-muted-foreground font-body">
              Complete preparation toolkit for Railway exams
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                {f.link ? (
                  <Link
                    to={f.link as "/dashboard" | "/revision" | "/leaderboard"}
                    data-ocid={`home.feature_${f.title.toLowerCase().replace(/\s+/g, "_")}_link`}
                    className="block text-center p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group"
                  >
                    <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1 text-sm">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-body leading-relaxed">
                      {f.desc}
                    </p>
                  </Link>
                ) : (
                  <div className="text-center p-5 rounded-2xl bg-card border border-border">
                    <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1 text-sm">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-body leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ─────────────────────────────────────────── */}
      <section className="bg-navy-deep py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { val: "2025", label: "Updated Syllabus" },
              { val: "3", label: "Exam Categories" },
              { val: "4", label: "Subject Sections" },
              { val: "3", label: "Test Modes" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl font-display font-black text-amber-vivid mb-1">
                  {s.val}
                </div>
                <div className="text-white/60 font-body text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Train className="mx-auto h-12 w-12 text-primary/40 mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-black mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-8 max-w-lg mx-auto">
            Join thousands of aspirants who trust RailPrep for their RRB exam
            preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="home.start_practice_button"
              size="lg"
              className="font-display font-bold text-base px-8"
              onClick={() => handleSelectExam("RRB NTPC")}
            >
              Start Practice Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              data-ocid="home.dashboard_button"
              size="lg"
              variant="outline"
              className="font-display font-bold text-base px-8"
              asChild
            >
              <Link to="/dashboard">
                <Award className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
