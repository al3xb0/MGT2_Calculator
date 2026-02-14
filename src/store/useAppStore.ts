import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

interface AppState {
  // Window state
  alwaysOnTop: boolean;
  opacity: number;
  isInitialized: boolean;
  
  // Actions
  setAlwaysOnTop: (value: boolean) => Promise<void>;
  toggleAlwaysOnTop: () => Promise<void>;
  setOpacity: (value: number) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  alwaysOnTop: false,
  opacity: 1,
  isInitialized: false,

  setAlwaysOnTop: async (value: boolean) => {
    try {
      await invoke("set_always_on_top", { alwaysOnTop: value });
      localStorage.setItem("mgt2-always-on-top", String(value));
      set({ alwaysOnTop: value });
    } catch (error) {
      console.error("Failed to set always on top:", error);
    }
  },

  toggleAlwaysOnTop: async () => {
    const currentValue = get().alwaysOnTop;
    await get().setAlwaysOnTop(!currentValue);
  },

  setOpacity: async (value: number) => {
    document.documentElement.style.setProperty("--app-opacity", String(value));
    localStorage.setItem("mgt2-opacity", String(value));
    set({ opacity: value });
  },

  initialize: async () => {
    // Restore always on top preference
    const savedOnTop = localStorage.getItem("mgt2-always-on-top") === "true";
    if (savedOnTop) {
      await get().setAlwaysOnTop(true);
    }

    // Restore opacity preference
    const savedOpacity = parseFloat(localStorage.getItem("mgt2-opacity") || "1");
    if (savedOpacity < 1) {
      document.documentElement.style.setProperty("--app-opacity", String(savedOpacity));
      set({ opacity: savedOpacity });
    }

    set({ isInitialized: true });
  },
}));
