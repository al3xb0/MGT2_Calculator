import { create } from "zustand";
import {
  Genre,
  GameSliders,
  AlignmentSliders,
  DesignFocus,
  getGenreById,
  getEffectiveSliders,
} from "../data/genres";
import { Theme, getThemeById } from "../data/themes";

export interface HistoryEntry {
  mainGenreId: string;
  subgenreId: string | null;
  themeId: string | null;
  timestamp: number;
}

const MAX_HISTORY = 5;
const HISTORY_KEY = "mgt2-history";

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

interface CalculatorState {
  // Selected values
  mainGenreId: string | null;
  subgenreId: string | null;
  themeId: string | null;

  // Computed data (cached)
  mainGenre: Genre | null;
  subgenre: Genre | null;
  theme: Theme | null;
  combinedSliders: GameSliders | null;
  alignment: AlignmentSliders | null;
  designFocus: DesignFocus | null;

  // UI state
  themeSearchQuery: string;

  // History
  history: HistoryEntry[];

  // Actions
  setMainGenre: (genreId: string | null) => void;
  setSubgenre: (genreId: string | null) => void;
  setTheme: (themeId: string | null) => void;
  setThemeSearchQuery: (query: string) => void;
  reset: () => void;
  saveToHistory: () => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;

  // Computed helpers
  isSubgenreCompatible: (subgenreId: string) => boolean;
  isThemeCompatible: (themeId: string) => boolean;
}

function recalculate(mainGenre: Genre | null, subgenreId: string | null) {
  if (!mainGenre) {
    return { combinedSliders: null, alignment: null, designFocus: null };
  }

  const { sliders, alignment } = getEffectiveSliders(mainGenre, subgenreId);
  return {
    combinedSliders: sliders,
    alignment,
    designFocus: mainGenre.designFocus,
  };
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Initial state
  mainGenreId: null,
  subgenreId: null,
  themeId: null,
  mainGenre: null,
  subgenre: null,
  theme: null,
  combinedSliders: null,
  alignment: null,
  designFocus: null,
  themeSearchQuery: "",
                                      history: loadHistory(),

  // Actions
  setMainGenre: (genreId) => {
    const mainGenre = genreId ? getGenreById(genreId) || null : null;
    const currentSubgenreId = get().subgenreId;

    // Reset subgenre if it's no longer compatible
    let newSubgenreId = currentSubgenreId;
    let newSubgenre = get().subgenre;

    if (mainGenre && currentSubgenreId && !mainGenre.compatibleSubgenres.includes(currentSubgenreId)) {
      newSubgenreId = null;
      newSubgenre = null;
    }

    const computed = recalculate(mainGenre, newSubgenreId);

    set({
      mainGenreId: genreId,
      mainGenre,
      subgenreId: newSubgenreId,
      subgenre: newSubgenre,
      ...computed,
    });
  },

  setSubgenre: (genreId) => {
    const subgenre = genreId ? getGenreById(genreId) || null : null;
    const mainGenre = get().mainGenre;

    const computed = recalculate(mainGenre, genreId);

    set({
      subgenreId: genreId,
      subgenre,
      ...computed,
    });

    // Auto-save to history when we have at least a main genre
    if (get().mainGenreId) {
      get().saveToHistory();
    }
  },

  setTheme: (themeId) => {
    const theme = themeId ? getThemeById(themeId) || null : null;
    set({ themeId, theme });
    // Auto-save to history when we have at least a main genre
    if (get().mainGenreId) {
      get().saveToHistory();
    }
  },

  setThemeSearchQuery: (query) => {
    set({ themeSearchQuery: query });
  },

  saveToHistory: () => {
    const { mainGenreId, subgenreId, themeId, history } = get();
    if (!mainGenreId) return;

    const entry: HistoryEntry = {
      mainGenreId,
      subgenreId,
      themeId,
      timestamp: Date.now(),
    };

    // Remove duplicate entries (same combo)
    const filtered = history.filter(
      (h) =>
        h.mainGenreId !== entry.mainGenreId ||
        h.subgenreId !== entry.subgenreId ||
        h.themeId !== entry.themeId
    );

    const newHistory = [entry, ...filtered].slice(0, MAX_HISTORY);
    saveHistory(newHistory);
    set({ history: newHistory });
  },

  loadFromHistory: (entry) => {
    const mainGenre = getGenreById(entry.mainGenreId) || null;
    const subgenre = entry.subgenreId ? getGenreById(entry.subgenreId) || null : null;
    const theme = entry.themeId ? getThemeById(entry.themeId) || null : null;
    const computed = recalculate(mainGenre, entry.subgenreId);

    set({
      mainGenreId: entry.mainGenreId,
      subgenreId: entry.subgenreId,
      themeId: entry.themeId,
      mainGenre,
      subgenre,
      theme,
      themeSearchQuery: "",
      ...computed,
    });
  },

  reset: () => {
    set({
      mainGenreId: null,
      subgenreId: null,
      themeId: null,
      mainGenre: null,
      subgenre: null,
      theme: null,
      combinedSliders: null,
      alignment: null,
      designFocus: null,
      themeSearchQuery: "",
    });
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
    set({ history: [] });
  },

  // Helpers
  isSubgenreCompatible: (subgenreId: string) => {
    const mainGenre = get().mainGenre;
    if (!mainGenre) return false;
    return mainGenre.compatibleSubgenres.includes(subgenreId);
  },

  isThemeCompatible: (themeId: string) => {
    const mainGenre = get().mainGenre;
    const theme = getThemeById(themeId);
    if (!mainGenre || !theme) return false;
    return theme.compatibleGenres.includes(mainGenre.id);
  },
}));
