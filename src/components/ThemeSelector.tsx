import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { THEMES } from "../data/themes";
import { useCalculatorStore } from "../store/useCalculatorStore";

export function ThemeSelector() {
  const { t } = useTranslation();
  const {
    mainGenreId,
    themeId,
    themeSearchQuery,
    setTheme,
    setThemeSearchQuery,
    isThemeCompatible,
  } = useCalculatorStore(useShallow((s) => ({
    mainGenreId: s.mainGenreId,
    themeId: s.themeId,
    themeSearchQuery: s.themeSearchQuery,
    setTheme: s.setTheme,
    setThemeSearchQuery: s.setThemeSearchQuery,
    isThemeCompatible: s.isThemeCompatible,
  })));

  const getTopicName = (id: string): string => {
    const translated = t(`topics.${id}`);
    return translated !== `topics.${id}` ? translated : id;
  };

  const filteredThemes = useMemo(() => {
    if (!themeSearchQuery.trim()) return THEMES;
    const query = themeSearchQuery.toLowerCase();
    return THEMES.filter((theme) => {
      const localizedName = t(`topics.${theme.id}`);
      return (
        theme.name.toLowerCase().includes(query) ||
        localizedName.toLowerCase().includes(query)
      );
    });
  }, [themeSearchQuery, t]);

  // Sort themes: compatible first, then alphabetically
  const sortedThemes = useMemo(() => {
    if (!mainGenreId) return filteredThemes;

    return [...filteredThemes].sort((a, b) => {
      const aCompatible = isThemeCompatible(a.id);
      const bCompatible = isThemeCompatible(b.id);

      if (aCompatible && !bCompatible) return -1;
      if (!aCompatible && bCompatible) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredThemes, mainGenreId, isThemeCompatible]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-panel rounded-lg border border-panel">
      {/* Header with search */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-700/50">
        <label className="text-xs uppercase tracking-wider text-gray-500 flex-shrink-0 font-medium">
          {t("calculator.topic")}
        </label>
        <div className="relative flex-1">
          <input
            type="text"
            value={themeSearchQuery}
            onChange={(e) => setThemeSearchQuery(e.target.value)}
            placeholder={t("calculator.searchTopic")}
            className="w-full bg-gray-700/40 border border-gray-600/30 rounded-lg px-3 py-1.5 pl-8 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-purple-500"
          />
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Scrollable topic list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sortedThemes.length === 0 ? (
          <div className="px-3 py-4 text-center text-gray-600 text-sm">
            No topics found
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {sortedThemes.map((theme) => {
              const isCompatible = mainGenreId
                ? isThemeCompatible(theme.id)
                : false;
              const isSelected = themeId === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(isSelected ? null : theme.id)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-600/20 text-purple-200"
                      : isCompatible
                      ? "text-green-400 hover:bg-green-900/20"
                      : "text-gray-500 hover:bg-gray-700/30"
                  }`}
                >
                  <span className="truncate">{getTopicName(theme.id)}</span>
                  {mainGenreId && (
                    <span
                      className={`flex-shrink-0 ml-2 text-xs ${
                        isCompatible ? "text-green-500" : "text-gray-700"
                      }`}
                    >
                      {isCompatible ? "✓" : "✗"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
