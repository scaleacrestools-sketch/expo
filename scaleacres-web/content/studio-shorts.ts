/**
 * Creative Studio videos exactly as published in the "Real Estate Videos That Drive Growth" tabs
 * on scaleacres.com (YouTube Shorts, captured 19 Oct 2026). Order follows the live site.
 */
export type StudioShortTab = { id: "ai-videos" | "social-media-videos" | "ad-videos"; label: string; description: string; youtubeIds: string[] };

export const studioShorts: StudioShortTab[] = [
  { id: "ai-videos", label: "AI Videos", description: "Imaginative, AI-powered visual content designed to bring fresh perspectives and creative possibilities to brand storytelling.", youtubeIds: ["1ZXNwVLM7T4", "O1FJdO2yZOY", "z37JFVVNIYk", "5Pm2Z6WszRc", "FxO_2KVX4zA", "ZQa0XNGiN7Y", "TyFCnkRBg_I"] },
  { id: "social-media-videos", label: "Social Media Videos", description: "Short-form videos and platform-ready content designed to connect, engage and make brands part of the conversation.", youtubeIds: ["hU-pHCMCKqo", "tdXNax-PUNQ", "gRVdTT7lOPk", "XfgdunDbBzE", "MdluDjATzgA", "8_U_WnEdVjA", "Mqaa4zG7KoM", "3QHjnPGdrWc", "yILr4FpP2bc", "qEaDnpK8Eko"] },
  { id: "ad-videos", label: "Ad Videos", description: "Creative advertising videos that combine attention-grabbing visuals, clear messaging and strong campaign communication.", youtubeIds: ["vgsUylyADPY", "fRnzr1dSYMg", "0NmdVrMelSQ", "Z1ez2sINaao", "vODoeG2QEKQ", "QkCSgbRHJ0g", "HXVFHKSOmVE", "Hh6lSEZ0WyY", "nRFeRCMZG3E", "ZHutu1FSoZE", "9GUSJ8zlvRA", "csgbYpTlQMI", "n_4PVw_el-4", "C0IOhWkdIsk", "BBMl5Eu45Uo", "8asleHthu7s", "pxwAcEvzBho", "E4XbXltF_Js", "yrUbHs9mOyg", "KzG-REdaJ3U", "v5M7tV3Sbx4", "Qe4aRJQf-LI"] },
];
