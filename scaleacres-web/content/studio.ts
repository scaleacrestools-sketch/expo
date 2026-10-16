import { showreel } from "@/content/media";

export type StudioTabId = "ai-videos" | "social-media-videos" | "ad-videos";

export type StudioVideo = {
  id: string;
  title: string;
  category: string;
  /** Video URL (local /videos/... export or approved CDN link). */
  src: string;
  /** Portrait source for phones, when available. */
  portrait?: string;
  description: string;
};

export type StudioTab = {
  id: StudioTabId;
  label: string;
  description: string;
  videos: StudioVideo[];
  /** Shown when a tab has no approved videos yet. */
  pendingNote?: string;
};

/**
 * Tabs are fixed: AI VIDEOS | SOCIAL MEDIA VIDEOS | AD VIDEOS.
 * AI Videos uses the ScaleAcres concept clips generated in Higgsfield.
 * Social and Ad videos must be real, client-approved ScaleAcres work (see docs/launch-readiness.md).
 */
export const studioTabs: StudioTab[] = [
  {
    id: "ai-videos",
    label: "AI Videos",
    description:
      "Imaginative, AI-powered visual content designed to bring fresh perspectives and creative possibilities to brand storytelling.",
    videos: showreel.map((c) => ({
      id: `ai-${c.id}`,
      title: c.title,
      category: "AI Video",
      src: c.landscape,
      portrait: c.portrait,
      description: c.description,
    })),
  },
  {
    id: "social-media-videos",
    label: "Social Media Videos",
    description:
      "Short-form videos and platform-ready content designed to connect, engage and make brands part of the conversation.",
    videos: [],
    pendingNote:
      "Approved project reels (e.g. Auriga 9, DTC Stillwaters, La Wisteria, Codename Flow) will appear here once exported for web and cleared by each client.",
  },
  {
    id: "ad-videos",
    label: "Ad Videos",
    description:
      "Creative advertising videos that combine attention-grabbing visuals, clear messaging and strong campaign communication.",
    videos: [],
    pendingNote: "Approved campaign ad films will appear here once exported for web and cleared by each client.",
  },
];
