import { describe, it, expect } from "vitest";
import {
  GENRES,
  COMBINATION_SLIDERS,
  getGenreById,
  getCombinationSliders,
  getEffectiveSliders,
} from "../data/genres";

describe("genres data", () => {
  it("should have 19 genres", () => {
    expect(GENRES).toHaveLength(19);
  });

  it("each genre should have unique id", () => {
    const ids = GENRES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each genre should have valid target audiences", () => {
    const validAudiences = ["everyone", "children", "teenagers", "adults", "seniors"];
    GENRES.forEach((genre) => {
      expect(genre.targetAudience.length).toBeGreaterThan(0);
      genre.targetAudience.forEach((a) => {
        expect(validAudiences).toContain(a);
      });
    });
  });

  it("each genre should have slider values between 0 and 10", () => {
    GENRES.forEach((genre) => {
      Object.values(genre.sliders).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      });
      Object.values(genre.alignment).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      });
    });
  });

  it("design focus percentages should sum to 100", () => {
    GENRES.forEach((genre) => {
      const { gameplay, graphics, sound, tech } = genre.designFocus;
      expect(gameplay + graphics + sound + tech).toBe(100);
    });
  });

  it("compatible subgenres should reference existing genre ids", () => {
    const allIds = new Set(GENRES.map((g) => g.id));
    GENRES.forEach((genre) => {
      genre.compatibleSubgenres.forEach((subId) => {
        expect(allIds.has(subId)).toBe(true);
      });
    });
  });
});

describe("getGenreById", () => {
  it("should find existing genre", () => {
    const result = getGenreById("action");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Action");
  });

  it("should return undefined for non-existing genre", () => {
    expect(getGenreById("nonexistent")).toBeUndefined();
  });
});

describe("getCombinationSliders", () => {
  it("should find existing combination", () => {
    const result = getCombinationSliders("action", "adventure");
    expect(result).toBeDefined();
    expect(result?.sliders.gameLength).toBeDefined();
  });

  it("should return undefined for non-existing combination", () => {
    expect(getCombinationSliders("action", "nonexistent")).toBeUndefined();
  });
});

describe("getEffectiveSliders", () => {
  it("should return combo sliders when subgenre combo exists", () => {
    const genre = getGenreById("action")!;
    const result = getEffectiveSliders(genre, "adventure");

    const combo = getCombinationSliders("action", "adventure")!;
    expect(result.sliders).toEqual(combo.sliders);
    expect(result.alignment).toEqual(combo.alignment);
  });

  it("should return base genre sliders when no subgenre", () => {
    const genre = getGenreById("action")!;
    const result = getEffectiveSliders(genre);

    expect(result.sliders).toEqual(genre.sliders);
    expect(result.alignment).toEqual(genre.alignment);
  });

  it("should return base genre sliders for unknown combination", () => {
    const genre = getGenreById("action")!;
    const result = getEffectiveSliders(genre, "racing"); // action+racing might not exist

    // If no combo data exists, falls back to base
    const combo = getCombinationSliders("action", "racing");
    if (!combo) {
      expect(result.sliders).toEqual(genre.sliders);
    }
  });
});

describe("COMBINATION_SLIDERS", () => {
  it("should reference valid genre ids", () => {
    const allIds = new Set(GENRES.map((g) => g.id));
    COMBINATION_SLIDERS.forEach((combo) => {
      expect(allIds.has(combo.mainGenreId)).toBe(true);
      expect(allIds.has(combo.subgenreId)).toBe(true);
    });
  });

  it("should have slider values between 0 and 10", () => {
    COMBINATION_SLIDERS.forEach((combo) => {
      Object.values(combo.sliders).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      });
      Object.values(combo.alignment).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      });
    });
  });
});
