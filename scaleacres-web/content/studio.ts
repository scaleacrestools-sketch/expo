export type StudioTabId = "ai-videos" | "social-media-videos" | "ad-videos";

export type StudioVideo = {
  id: string;
  title: string;
  category: string;
  /** Ordered sources under /public/videos (WebM first, MP4 fallback). Must be approved ScaleAcres assets. */
  sources: { src: string; type: string }[];
  poster: string;
  aspect: "16/9" | "9/16" | "1/1" | "4/5";
  placeholder: boolean;
};

export type StudioTab = {
  id: StudioTabId;
  label: string;
  description: string;
  videos: StudioVideo[];
};

/**
 * Tabs are fixed: AI VIDEOS | SOCIAL MEDIA VIDEOS | AD VIDEOS.
 * Video entries are development placeholders until approved exports are added
 * (see docs/asset-checklist.md for the Drive sources identified).
 */
export const studioTabs: StudioTab[] = [
  {
    id: "ai-videos",
    label: "AI Videos",
    description:
      "Imaginative, AI-powered visual content designed to bring fresh perspectives and creative possibilities to brand storytelling.",
    videos: [
      { id: "ai-01", title: "AI concept film — asset pending", category: "AI Video", sources: [{ src: "/videos/placeholder-landscape.webm", type: "video/webm" }, { src: "/videos/placeholder-landscape.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-landscape.svg", aspect: "16/9", placeholder: true },
      { id: "ai-02", title: "AI product visual — asset pending", category: "AI Video", sources: [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" }, { src: "/videos/placeholder-portrait.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-portrait.svg", aspect: "9/16", placeholder: true },
      { id: "ai-03", title: "AI brand teaser — asset pending", category: "AI Video", sources: [{ src: "/videos/placeholder-square.webm", type: "video/webm" }, { src: "/videos/placeholder-square.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-square.svg", aspect: "1/1", placeholder: true },
    ],
  },
  {
    id: "social-media-videos",
    label: "Social Media Videos",
    description:
      "Short-form videos and platform-ready content designed to connect, engage and make brands part of the conversation.",
    videos: [
      { id: "sm-01", title: "Project launch reel — asset pending", category: "Reel", sources: [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" }, { src: "/videos/placeholder-portrait.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-portrait.svg", aspect: "9/16", placeholder: true },
      { id: "sm-02", title: "Festive brand story — asset pending", category: "Story", sources: [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" }, { src: "/videos/placeholder-portrait.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-portrait.svg", aspect: "9/16", placeholder: true },
      { id: "sm-03", title: "Walkthrough edit — asset pending", category: "Reel", sources: [{ src: "/videos/placeholder-landscape.webm", type: "video/webm" }, { src: "/videos/placeholder-landscape.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-landscape.svg", aspect: "16/9", placeholder: true },
    ],
  },
  {
    id: "ad-videos",
    label: "Ad Videos",
    description:
      "Creative advertising videos that combine attention-grabbing visuals, clear messaging and strong campaign communication.",
    videos: [
      { id: "ad-01", title: "Campaign ad film — asset pending", category: "Ad Video", sources: [{ src: "/videos/placeholder-landscape.webm", type: "video/webm" }, { src: "/videos/placeholder-landscape.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-landscape.svg", aspect: "16/9", placeholder: true },
      { id: "ad-02", title: "Vertical performance ad — asset pending", category: "Ad Video", sources: [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" }, { src: "/videos/placeholder-portrait.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-portrait.svg", aspect: "9/16", placeholder: true },
      { id: "ad-03", title: "Feed ad cutdown — asset pending", category: "Ad Video", sources: [{ src: "/videos/placeholder-square.webm", type: "video/webm" }, { src: "/videos/placeholder-square.mp4", type: "video/mp4" }], poster: "/images/studio/placeholder-square.svg", aspect: "1/1", placeholder: true },
    ],
  },
];
