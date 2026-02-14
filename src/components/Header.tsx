import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "../store/useAppStore";
import { useCalculatorStore } from "../store/useCalculatorStore";

const languages = [
  { code: "en", name: "English", label: "EN" },
  { code: "ru", name: "Русский", label: "RU" },
  { code: "pl", name: "Polski", label: "PL" },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const { alwaysOnTop, toggleAlwaysOnTop, opacity, setOpacity } = useAppStore();
  const reset = useCalculatorStore((s) => s.reset);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("mgt2-language", langCode);
  };

  return (
    <header
      data-tauri-drag-region
      className="bg-header border-b border-panel px-3 py-1.5 rounded-t-lg"
    >
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-sm font-bold text-white tracking-wide">
          {t("app.title")}
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Opacity */}
          <div className="flex items-center gap-1.5" title={t("header.opacity")}>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <input
              type="range"
              min="50"
              max="100"
              value={Math.round(opacity * 100)}
              onChange={(e) => setOpacity(Number(e.target.value) / 100)}
              className="w-14 h-1 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Reset All */}
          <button
            onClick={reset}
            className="p-1 rounded text-gray-500 hover:text-yellow-400 transition-all"
            title={t("header.resetAll")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Always on Top */}
          <button
            onClick={toggleAlwaysOnTop}
            className={`p-1 rounded transition-all ${
              alwaysOnTop
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title={t("header.alwaysOnTop")}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z" />
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-gray-700" />

          {/* Language Selector */}
          <div className="flex items-center gap-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-1.5 py-0.5 rounded text-xs font-bold transition-all ${
                  i18n.language === lang.code
                    ? "bg-purple-600 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                title={lang.name}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-gray-700" />

          {/* Window Controls */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => invoke("minimize_window")}
              className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700/50"
              title="Minimize"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </button>
            <button
              onClick={() => invoke("maximize_window")}
              className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700/50"
              title="Maximize"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={() => invoke("close_window")}
              className="p-1 rounded text-gray-500 hover:text-white hover:bg-red-600/80"
              title="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
