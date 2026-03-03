import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AppLayout from "./components/AppLayout";
import { QuizProvider } from "./context/QuizContext";
import ConfigurePage from "./pages/ConfigurePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import ReviewPage from "./pages/ReviewPage";
import RevisionPage from "./pages/RevisionPage";

// ─── Root Route ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <QuizProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster richColors position="top-right" />
    </QuizProvider>
  ),
});

// ─── Page Routes ──────────────────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const configureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/configure",
  component: ConfigurePage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/result",
  component: ResultPage,
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/review",
  component: ReviewPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const revisionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/revision",
  component: RevisionPage,
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  configureRoute,
  quizRoute,
  resultRoute,
  reviewRoute,
  dashboardRoute,
  leaderboardRoute,
  revisionRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
