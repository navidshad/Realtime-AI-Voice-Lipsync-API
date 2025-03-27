import { atom } from "jotai";
import { ConversationDialog, TokenUsage, LiveSession } from "../ai-logic/types";
import { flows } from "../flows";
import {Config, defaultConfig} from "../constants";

export const configurationAtom = atom({
  ...defaultConfig
} as Config)

// Example of a basic atom
export const countAtom = atom(0);

// Example of a derived atom (computed state)
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Example of a writable derived atom
export const countWithUpdateAtom = atom(
  (get) => get(countAtom),
  (get, set, newValue: number) => {
    set(countAtom, newValue);
  }
);

// Theme atom example
export type Theme = "light" | "dark";
export const themeAtom = atom<Theme>("light");

// User preferences atom example
export interface UserPreferences {
  notifications: boolean;
  language: string;
}

export const userPreferencesAtom = atom<UserPreferences>({
  notifications: true,
  language: "en",
});

// Loading state atom example
export const isLoadingAtom = atom(false);

// Error state atom example
export const errorAtom = atom<string | null>(null);

// Live Session Atoms
export const liveSessionIdAtom = atom<string | null>(null);
export const liveSessionAtom = atom<LiveSession | null>(null);
export const sessionStartedAtom = atom(false);
export const conversationDialogsAtom = atom<ConversationDialog[]>([]);
export const isMicrophoneMutedAtom = atom(false);
export const tokenUsageAtom = atom<TokenUsage | null>(null);

// Derived atoms for computed values
export const isSessionActiveAtom = atom((get) => get(sessionStartedAtom));
export const getConversationDialogsAtom = atom((get) =>
  get(conversationDialogsAtom)
);
export const getMicrophoneMutedAtom = atom((get) => get(isMicrophoneMutedAtom));

// Flow selection atom
export const selectedFlowAtom = atom<keyof typeof flows>("FlowDemo");
