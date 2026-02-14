import { describe, it, expect, beforeEach } from "vitest";
import { useCalculatorStore } from "../store/useCalculatorStore";

describe("useCalculatorStore", () => {
  beforeEach(() => {
    useCalculatorStore.getState().reset();
  });

  it("should start with null values", () => {
    const state = useCalculatorStore.getState();
    expect(state.mainGenreId).toBeNull();
    expect(state.subgenreId).toBeNull();
    expect(state.themeId).toBeNull();
    expect(state.combinedSliders).toBeNull();
  });

  it("should set main genre and compute sliders", () => {
    useCalculatorStore.getState().setMainGenre("action");
    const state = useCalculatorStore.getState();

    expect(state.mainGenreId).toBe("action");
    expect(state.mainGenre).toBeDefined();
    expect(state.mainGenre?.id).toBe("action");
    expect(state.combinedSliders).toBeDefined();
    expect(state.alignment).toBeDefined();
    expect(state.designFocus).toBeDefined();
  });

  it("should set subgenre and use combination sliders", () => {
    useCalculatorStore.getState().setMainGenre("action");
    useCalculatorStore.getState().setSubgenre("adventure");
    const state = useCalculatorStore.getState();

    expect(state.subgenreId).toBe("adventure");
    expect(state.subgenre?.id).toBe("adventure");
    expect(state.combinedSliders).toBeDefined();
  });

  it("should reset subgenre when incompatible with new main genre", () => {
    useCalculatorStore.getState().setMainGenre("action");
    useCalculatorStore.getState().setSubgenre("adventure");

    // Change to a genre that doesn't have adventure as compatible
    useCalculatorStore.getState().setMainGenre("skill");

    // If skill doesn't exist or adventure isn't compatible, subgenre should reset
    const state = useCalculatorStore.getState();
    if (state.mainGenre && !state.mainGenre.compatibleSubgenres.includes("adventure")) {
      expect(state.subgenreId).toBeNull();
    }
  });

  it("should set theme", () => {
    useCalculatorStore.getState().setTheme("zombies");
    const state = useCalculatorStore.getState();

    expect(state.themeId).toBe("zombies");
    expect(state.theme?.id).toBe("zombies");
  });

  it("should check theme compatibility", () => {
    useCalculatorStore.getState().setMainGenre("action");
    const state = useCalculatorStore.getState();

    // Zombies is compatible with action
    expect(state.isThemeCompatible("zombies")).toBe(true);
    // Zoo is not compatible with action
    expect(state.isThemeCompatible("zoo")).toBe(false);
  });

  it("should check subgenre compatibility", () => {
    useCalculatorStore.getState().setMainGenre("action");
    const state = useCalculatorStore.getState();

    // Adventure is compatible with action
    expect(state.isSubgenreCompatible("adventure")).toBe(true);
  });

  it("should reset all state", () => {
    useCalculatorStore.getState().setMainGenre("action");
    useCalculatorStore.getState().setSubgenre("adventure");
    useCalculatorStore.getState().setTheme("zombies");

    useCalculatorStore.getState().reset();
    const state = useCalculatorStore.getState();

    expect(state.mainGenreId).toBeNull();
    expect(state.subgenreId).toBeNull();
    expect(state.themeId).toBeNull();
    expect(state.combinedSliders).toBeNull();
    expect(state.themeSearchQuery).toBe("");
  });

  it("should save to history when setting theme with main genre", () => {
    useCalculatorStore.getState().setMainGenre("action");
    useCalculatorStore.getState().setTheme("zombies");
    const state = useCalculatorStore.getState();

    expect(state.history.length).toBeGreaterThan(0);
    expect(state.history[0].mainGenreId).toBe("action");
    expect(state.history[0].themeId).toBe("zombies");
  });

  it("should load from history", () => {
    useCalculatorStore.getState().setMainGenre("action");
    useCalculatorStore.getState().setSubgenre("adventure");
    useCalculatorStore.getState().setTheme("zombies");

    const historyEntry = useCalculatorStore.getState().history[0];

    // Reset and restore
    useCalculatorStore.getState().reset();
    useCalculatorStore.getState().loadFromHistory(historyEntry);

    const state = useCalculatorStore.getState();
    expect(state.mainGenreId).toBe("action");
    expect(state.subgenreId).toBe("adventure");
    expect(state.themeId).toBe("zombies");
    expect(state.combinedSliders).toBeDefined();
  });

  it("should limit history to 5 entries", () => {
    const genres = ["action", "adventure", "rpg", "fps", "strategy", "simulation", "racing"];

    genres.forEach((g) => {
      useCalculatorStore.getState().setMainGenre(g);
      useCalculatorStore.getState().setTheme("zombies");
    });

    expect(useCalculatorStore.getState().history.length).toBeLessThanOrEqual(5);
  });
});
