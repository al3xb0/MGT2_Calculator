import { describe, it, expect } from "vitest";
import { THEMES, getThemeById, getCompatibleThemesForGenre } from "../data/themes";

describe("themes data", () => {
  it("should have themes loaded", () => {
    expect(THEMES.length).toBeGreaterThan(100);
  });

  it("each theme should have unique id", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each theme should have at least one compatible genre", () => {
    THEMES.forEach((theme) => {
      expect(theme.compatibleGenres.length).toBeGreaterThan(0);
    });
  });
});

describe("getThemeById", () => {
  it("should find existing theme", () => {
    const result = getThemeById("zombies");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Zombies");
  });

  it("should return undefined for non-existing theme", () => {
    expect(getThemeById("nonexistent")).toBeUndefined();
  });
});

describe("getCompatibleThemesForGenre", () => {
  it("should return themes compatible with action", () => {
    const result = getCompatibleThemesForGenre("action");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((theme) => {
      expect(theme.compatibleGenres).toContain("action");
    });
  });

  it("should return empty array for invalid genre", () => {
    const result = getCompatibleThemesForGenre("nonexistent");
    expect(result).toHaveLength(0);
  });
});
