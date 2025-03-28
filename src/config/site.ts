import { ENVS } from "@/utils/constants/envs"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "WLTTRPG Club",
  title: "Western Loudoun Table Top Roleplaying Game Club (WLTTRPG Club)",
  description: "Club for table top roleplaying gamers in the Western Loudoun area.",
  icons: {
    icon: "/favicon.ico"
  },
  keywords: [
    "RPG",
    "Tabletop",
    "Roleplaying",
    "Western Loudoun",
    "WLTTRPG",
    "WLTTRPG Club",
    "WLTTRPG Club Website",
    "D&D",
    "Pathfinder"
  ],
  manifest: "/manifest.json",
  url:
    ENVS.NEXT_PUBLIC_SITE_URL
        ?? ENVS.IS_DEV
            ? "http://localhost:3000"
            : "https://wl-ttrpg.kaje.org",
  links: { github: "https://github.com/mcdaddytalk/wl-ttrpg" },
}