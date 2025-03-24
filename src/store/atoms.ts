import { atom } from "jotai";

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
export type Theme = 'light' | 'dark';
export const themeAtom = atom<Theme>('light');

// User preferences atom example
export interface UserPreferences {
  notifications: boolean;
  language: string;
}

export const userPreferencesAtom = atom<UserPreferences>({
  notifications: true,
  language: 'en',
});

// Loading state atom example
export const isLoadingAtom = atom(false);

// Error state atom example
export const errorAtom = atom<string | null>(null); 