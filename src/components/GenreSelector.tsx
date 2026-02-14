import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { GENRES } from "../data/genres";
import { GENRE_ICONS } from "../data/genreIcons";
import { useCalculatorStore } from "../store/useCalculatorStore";

function GenreDropdown({
  value,
  genres,
  placeholder,
  onChange,
  getGenreName,
  compatibleIds,
}: {
  value: string | null;
  genres: { id: string; name: string }[];
  placeholder: string;
  onChange: (id: string | null) => void;
  getGenreName: (id: string) => string;
  compatibleIds?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Items: [null (clear option), ...genre ids]
  const itemIds: (string | null)[] = [null, ...genres.map((g) => g.id)];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset highlighted index when opening
  useEffect(() => {
    if (open) {
      const currentIdx = value ? itemIds.indexOf(value) : 0;
      setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [open]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (open && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll("[data-dropdown-item]");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < itemIds.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : itemIds.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < itemIds.length) {
            onChange(itemIds[highlightedIndex]);
            setOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, highlightedIndex, itemIds, onChange]
  );

  const selectedGenre = genres.find((g) => g.id === value);

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-left hover:border-gray-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value && GENRE_ICONS[value] && (
          <img src={GENRE_ICONS[value]} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
        )}
        <span className={`flex-1 text-sm truncate ${selectedGenre ? "text-white" : "text-gray-500"}`}>
          {selectedGenre ? getGenreName(selectedGenre.id) : placeholder}
        </span>
        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto"
        >
          {/* None option */}
          <button
            data-dropdown-item
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-700 ${
              highlightedIndex === 0 ? "ring-1 ring-inset ring-purple-500" : ""
            } ${!value ? "bg-purple-600/20 text-purple-300" : "text-gray-400"}`}
          >
            <span className="w-6 h-6 flex items-center justify-center text-gray-600 text-xs">—</span>
            <span>{placeholder}</span>
          </button>

          {genres.map((genre, i) => {
            const isSelected = value === genre.id;
            const isCompatible = compatibleIds?.includes(genre.id);
            const isHighlighted = highlightedIndex === i + 1;

            return (
              <button
                key={genre.id}
                data-dropdown-item
                onClick={() => { onChange(genre.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${
                  isHighlighted ? "ring-1 ring-inset ring-purple-500" : ""
                } ${
                  isSelected
                    ? "bg-purple-600/20 text-purple-200"
                    : isCompatible
                    ? "text-green-400 hover:bg-green-900/20"
                    : compatibleIds
                    ? "text-gray-500 hover:bg-gray-700/50"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                {GENRE_ICONS[genre.id] ? (
                  <img src={GENRE_ICONS[genre.id]} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                ) : (
                  <span className="w-6 h-6" />
                )}
                <span className="flex-1">{getGenreName(genre.id)}</span>
                {isCompatible && !isSelected && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GenreSelector() {
  const { t } = useTranslation();
  const { mainGenreId, subgenreId, mainGenre, setMainGenre, setSubgenre } =
    useCalculatorStore(useShallow((s) => ({
      mainGenreId: s.mainGenreId,
      subgenreId: s.subgenreId,
      mainGenre: s.mainGenre,
      setMainGenre: s.setMainGenre,
      setSubgenre: s.setSubgenre,
    })));

  const getGenreName = (id: string): string => {
    const translated = t(`genres.${id}`);
    return translated !== `genres.${id}` ? translated : id;
  };

  const availableSubgenres = mainGenre
    ? GENRES.filter((g) => g.id !== mainGenreId)
    : [];

  return (
    <div className="space-y-2">
      {/* Genre Selectors Row */}
      <div className="bg-panel rounded-lg p-3 border border-panel">
        <div className="flex gap-3">
          {/* Main Genre */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
              {t("calculator.mainGenre")}
            </label>
            <GenreDropdown
              value={mainGenreId}
              genres={GENRES}
              placeholder={t("calculator.selectGenre")}
              onChange={setMainGenre}
              getGenreName={getGenreName}
            />
          </div>

          {/* Subgenre */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
              {t("calculator.subgenre")}
            </label>
            {mainGenreId ? (
              <GenreDropdown
                value={subgenreId}
                genres={availableSubgenres}
                placeholder={t("calculator.noSelection")}
                onChange={setSubgenre}
                getGenreName={getGenreName}
                compatibleIds={mainGenre?.compatibleSubgenres}
              />
            ) : (
              <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-gray-600">
                {t("calculator.noSelection")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Audience — always show all 5 groups, green = compatible, gray = not */}
      {mainGenre && (
        <div className="bg-panel rounded-lg p-3 border border-panel">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
            {t("calculator.targetAudience")}
          </label>
          <div className="flex gap-2">
            {(["everyone", "children", "teenagers", "adults", "seniors"] as const).map((audience) => {
              const isActive = mainGenre.targetAudience.includes(audience);
              return (
                <div
                  key={audience}
                  className={`flex-1 text-center py-2 rounded-lg text-sm font-medium border ${
                    isActive
                      ? "bg-green-600/20 border-green-500/40 text-green-400"
                      : "bg-gray-800/30 border-gray-700/30 text-gray-600"
                  }`}
                >
                  {isActive && <span className="mr-1">✓</span>}
                  {t(`audience.${audience}`)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
