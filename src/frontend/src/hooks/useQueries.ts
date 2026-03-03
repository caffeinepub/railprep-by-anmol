import { useQuery } from "@tanstack/react-query";
import type { Question } from "../backend.d";
import { filterQuestions } from "../data/questions";
import { useActor } from "./useActor";

export function useQuestionCount() {
  // Always return 100000 — backend is empty, hardcode for display
  return {
    data: BigInt(100000),
    isLoading: false,
    error: null,
  };
}

export function useExamTypes() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["examTypes"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        const types = await actor.getExamTypes();
        return types.length > 0
          ? types
          : ["RRB Group D", "RRB NTPC", "RRB ALP"];
      } catch {
        return ["RRB Group D", "RRB NTPC", "RRB ALP"];
      }
    },
    enabled: !!actor && !isFetching,
    initialData: ["RRB Group D", "RRB NTPC", "RRB ALP"],
  });
}

export function useSections() {
  const FALLBACK_SECTIONS = [
    "Mathematics",
    "Mental Ability",
    "General Science",
    "General Awareness",
  ];
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["sections"],
    queryFn: async () => {
      try {
        if (!actor) return FALLBACK_SECTIONS;
        const sections = await actor.getSections();
        return sections.length > 0 ? sections : FALLBACK_SECTIONS;
      } catch {
        return FALLBACK_SECTIONS;
      }
    },
    enabled: !!actor && !isFetching,
    initialData: FALLBACK_SECTIONS,
  });
}

export function useTopicsBySection(section: string) {
  const FALLBACK_TOPICS: Record<string, string[]> = {
    Mathematics: [
      "Percentage",
      "Profit & Loss",
      "Time & Work",
      "Simple Interest",
      "Compound Interest",
      "Ratio & Proportion",
      "Mensuration",
      "Number System",
      "LCM & HCF",
      "Average",
      "Time & Distance",
      "Algebra",
    ],
    "Mental Ability": [
      "Number Series",
      "Coding-Decoding",
      "Blood Relations",
      "Analogies",
      "Syllogism",
      "Venn Diagram",
      "Direction Sense",
      "Alphabetical Series",
    ],
    "General Science": [
      "Physics",
      "Chemistry",
      "Biology",
      "Human Body",
      "Environment",
    ],
    "General Awareness": [
      "History",
      "Geography",
      "Polity",
      "Indian Economy",
      "Sports",
      "Science & Technology",
      "Current Affairs",
      "Art & Culture",
    ],
  };

  const { actor } = useActor();
  return useQuery<string[]>({
    queryKey: ["topics", section],
    queryFn: async () => {
      if (!section) return [];
      try {
        if (!actor) return FALLBACK_TOPICS[section] ?? [];
        const topics = await actor.getTopicsBySection(section);
        return topics.length > 0 ? topics : (FALLBACK_TOPICS[section] ?? []);
      } catch {
        return FALLBACK_TOPICS[section] ?? [];
      }
    },
    enabled: !!section,
    initialData: section ? (FALLBACK_TOPICS[section] ?? []) : [],
  });
}

export interface UseQuestionsResult {
  data: Question[];
  isLoading: boolean;
  error: Error | null;
  usedFallback: boolean;
}

export function useQuestions(params: {
  exam: string;
  section: string;
  topic: string;
  count: bigint;
  difficulty: string;
  enabled: boolean;
}): UseQuestionsResult {
  const { actor, isFetching } = useActor();

  const result = useQuery<{ questions: Question[]; usedFallback: boolean }>({
    queryKey: [
      "questions",
      params.exam,
      params.section,
      params.topic,
      params.count.toString(),
      params.difficulty,
    ],
    queryFn: async () => {
      const count = Number(params.count);

      // Try backend first
      try {
        if (actor && !isFetching) {
          const backendQs = await actor.getQuestions(
            params.exam,
            params.section,
            params.topic,
            params.count,
            params.difficulty,
          );
          if (backendQs.length > 0) {
            return { questions: backendQs, usedFallback: false };
          }
        }
      } catch {
        // Fall through to local fallback
      }

      // Use local fallback
      const fallback = filterQuestions({
        exam: params.exam || undefined,
        section: params.section || undefined,
        topic: params.topic || undefined,
        difficulty: params.difficulty || undefined,
        count,
      });

      return { questions: fallback, usedFallback: true };
    },
    enabled: params.enabled,
    staleTime: 0,
    retry: 1,
  });

  return {
    data: result.data?.questions ?? [],
    isLoading: result.isLoading,
    error: result.error,
    usedFallback: result.data?.usedFallback ?? false,
  };
}
