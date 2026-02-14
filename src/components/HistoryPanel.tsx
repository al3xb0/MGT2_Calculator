import { useTranslation } from "react-i18next";
import { useCalculatorStore, type HistoryEntry } from "../store/useCalculatorStore";

export function HistoryPanel() {
  const { t } = useTranslation();
  const { history, loadFromHistory, clearHistory } = useCalculatorStore();

  const getGenreName = (id: string): string => {
    const translated = t(`genres.${id}`);
    return translated !== `genres.${id}` ? translated : id;
  };

  const getTopicName = (id: string): string => {
    const translated = t(`topics.${id}`);
    return translated !== `topics.${id}` ? translated : id;
  };

  const formatEntry = (entry: HistoryEntry): string => {
    const parts = [getGenreName(entry.mainGenreId)];
    if (entry.subgenreId) parts.push(getGenreName(entry.subgenreId));
    if (entry.themeId) parts.push(getTopicName(entry.themeId));
    return parts.join(" + ");
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-panel rounded-lg border border-panel p-2">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          {t("calculator.history")}
        </span>
        <button
          onClick={clearHistory}
          className="p-0.5 rounded text-gray-600 hover:text-red-400 transition-all"
          title={t("calculator.clearHistory")}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {history.map((entry, i) => (
          <button
            key={`${entry.mainGenreId}-${entry.subgenreId}-${entry.themeId}-${i}`}
            onClick={() => loadFromHistory(entry)}
            className="px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-400 hover:text-purple-300 hover:bg-purple-600/20 transition-all truncate max-w-[200px]"
            title={formatEntry(entry)}
          >
            {formatEntry(entry)}
          </button>
        ))}
      </div>
    </div>
  );
}
