export interface AppStorage {
  sitesText: string;
  boopCounts: { [key: string]: number };
}

export const APP_STORAGE_KEYS = ["sitesText", "boopCounts"];
