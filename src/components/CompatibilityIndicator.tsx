import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useCalculatorStore } from "../store/useCalculatorStore";

export function CompatibilityIndicator() {
  const { t } = useTranslation();
  const { mainGenre, subgenre, theme, isSubgenreCompatible, isThemeCompatible } =
    useCalculatorStore(useShallow((s) => ({
      mainGenre: s.mainGenre,
      subgenre: s.subgenre,
      theme: s.theme,
      isSubgenreCompatible: s.isSubgenreCompatible,
      isThemeCompatible: s.isThemeCompatible,
    })));

  const getGenreName = (id: string): string => {
    const translated = t(`genres.${id}`);
    return translated !== `genres.${id}` ? translated : id;
  };

  const getTopicName = (id: string): string => {
    const translated = t(`topics.${id}`);
    return translated !== `topics.${id}` ? translated : id;
  };

  if (!mainGenre || (!subgenre && !theme)) return null;

  const genreSubgenreMatch = subgenre
    ? isSubgenreCompatible(subgenre.id)
    : null;
  const themeGenreMatch = theme ? isThemeCompatible(theme.id) : null;

  return (
    <div className="bg-panel rounded-lg px-3 py-2.5 border border-panel">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Genre + Subgenre */}
        {subgenre && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-500">
              {getGenreName(mainGenre.id)} + {getGenreName(subgenre.id)}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                genreSubgenreMatch
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {genreSubgenreMatch
                ? t("calculator.perfectMatch")
                : t("calculator.notCompatible")}
            </span>
          </div>
        )}

        {subgenre && theme && (
          <div className="w-px h-4 bg-gray-700" />
        )}

        {/* Topic + Genre */}
        {theme && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-500">
              {getTopicName(theme.id)} + {getGenreName(mainGenre.id)}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                themeGenreMatch
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {themeGenreMatch
                ? t("calculator.perfectMatch")
                : t("calculator.notCompatible")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
