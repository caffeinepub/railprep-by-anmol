import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Home,
  Menu,
  Train,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  {
    to: "/" as const,
    label: "Home",
    icon: <Home className="h-4 w-4" />,
    ocid: "nav.home_link",
  },
  {
    to: "/dashboard" as const,
    label: "Dashboard",
    icon: <BarChart2 className="h-4 w-4" />,
    ocid: "nav.dashboard_link",
  },
  {
    to: "/leaderboard" as const,
    label: "Leaderboard",
    icon: <Trophy className="h-4 w-4" />,
    ocid: "nav.leaderboard_link",
  },
  {
    to: "/revision" as const,
    label: "Revision",
    icon: <BookOpen className="h-4 w-4" />,
    ocid: "nav.revision_link",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isQuizPage = location.pathname === "/quiz";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Header (hide on quiz) ─────────────────────────────────── */}
      {!isQuizPage && (
        <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              data-ocid="nav.logo_link"
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Train className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-lg text-foreground">
                  RailPrep
                </span>
                <span className="text-xs font-body text-muted-foreground hidden sm:block">
                  by Anmol
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    data-ocid={link.ocid}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-display font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              data-ocid="nav.mobile_menu_button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
              <nav className="container max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      data-ocid={`nav.mobile_${link.ocid}`}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm font-display font-semibold rounded-lg transition-colors ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </header>
      )}

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ─── Footer (hide on quiz) ─────────────────────────────────── */}
      {!isQuizPage && (
        <footer className="border-t border-border bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-body text-muted-foreground">
            <div className="flex items-center gap-2">
              <Train className="h-4 w-4 text-primary/50" />
              <span className="font-display font-semibold text-foreground/70">
                RailPrep by Anmol
              </span>
              <span>— India's RRB Exam Prep Platform</span>
            </div>
            <div>
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
