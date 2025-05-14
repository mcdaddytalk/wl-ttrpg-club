import { experienceLevels } from "./types/custom";

export const unknownError = "An unknown error occurred. Please try again later."

function formatLevel(level: string): string {
    return level
      .replace(/-/g, ' ')                      // Replace dashes with spaces
      .split(' ')                              // Split into words
      .map(word => 
        word.toLowerCase() === 'gm' 
          ? 'GM'                               // Capitalize 'gm'
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
}
export const EXPERIENCE_LEVEL_SELECTOR = experienceLevels.map((level) => ({ label: formatLevel(level), value: level }))  
export type ExperienceLevelValue = typeof EXPERIENCE_LEVEL_SELECTOR[number]["value"];

export function getExperienceLabel(value: string | undefined): string {
    return EXPERIENCE_LEVEL_SELECTOR.find((lvl) => lvl.value === value)?.label ?? ""
}