import { useEffect } from "react";
import {
  Header,
  GenreSelector,
  ThemeSelector,
  SliderDisplay,
  CompatibilityIndicator,
  HistoryPanel,
} from "./components";
import { useAppStore } from "./store/useAppStore";
import "./i18n";
import "./App.css";

function App() {
  const { initialize, isInitialized } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center rounded-lg">
        <div className="animate-pulse text-purple-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col text-white overflow-hidden rounded-lg">
      <Header />

      <main className="flex-1 flex gap-3 p-3 min-h-0">
        {/* Left Column: Sliders + Alignment + Design Focus */}
        <div className="w-[400px] flex flex-col gap-2 min-h-0">
          <SliderDisplay />
        </div>

        {/* Right Column: Genre + Topic + Compatibility */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <GenreSelector />
          <CompatibilityIndicator />
          <HistoryPanel />
          <ThemeSelector />
        </div>
      </main>
    </div>
  );
}

export default App;
