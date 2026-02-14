import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useCalculatorStore } from "../store/useCalculatorStore";
import { SLIDER_LABELS } from "../data/genres";

function SliderBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value <= 3
      ? "bg-blue-500"
      : value <= 6
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="flex-1 h-2.5 bg-gray-700/60 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const DESIGN_ICONS: Record<string, string> = {
  gameplay: "🎮",
  graphics: "🎨",
  sound: "🔊",
  tech: "⚙️",
};

const DIRECTION_SLIDERS = [
  { key: "hardcore", leftKey: "direction.coreGamers", rightKey: "direction.casualGamers" },
  { key: "cruelty", leftKey: "direction.nonviolent", rightKey: "direction.explicitContent" },
  { key: "difficulty", leftKey: "direction.easy", rightKey: "direction.hard" },
] as const;

export function SliderDisplay() {
  const { t } = useTranslation();
  const { combinedSliders, alignment, designFocus } = useCalculatorStore(
    useShallow((s) => ({
      combinedSliders: s.combinedSliders,
      alignment: s.alignment,
      designFocus: s.designFocus,
    }))
  );

  if (!combinedSliders || !alignment || !designFocus) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/50">
        <p className="text-gray-600 text-sm">{t("calculator.noSelection")}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0">
      {/* Design Focus (was "Recommended Slider Values") */}
      <div className="bg-panel rounded-lg p-3 border border-panel">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
          {t("sliders.title")}
        </h3>
        <div className="space-y-2">
          {SLIDER_LABELS.map(({ key }) => {
            const value = combinedSliders[key as keyof typeof combinedSliders];
            return (
              <div key={key} className="flex items-center gap-2.5">
                <span className="w-[130px] text-sm text-gray-400 truncate">
                  {t(`sliders.${key}`)}
                </span>
                <SliderBar value={value} />
                <span className="w-7 text-right text-sm font-mono font-bold text-white">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Design Direction (was "Alignment") */}
      <div className="bg-panel rounded-lg p-3 border border-panel">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
          {t("sliders.alignmentTitle")}
        </h3>
        <div className="space-y-3">
          {DIRECTION_SLIDERS.map(({ key, leftKey, rightKey }) => {
            const value = alignment[key as keyof typeof alignment];
            const pct = (value / 10) * 100;
            return (
              <div key={key}>
                {/* Value centered above bar */}
                <div className="text-center mb-0.5">
                  <span className="text-sm font-mono font-bold text-white">
                    {value}
                  </span>
                </div>
                {/* Bar */}
                <div className="h-2.5 bg-gray-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {/* Labels below the bar */}
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-blue-400">{t(leftKey)}</span>
                  <span className="text-xs text-red-400">{t(rightKey)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Design Priority (percentages) */}
      <div className="bg-panel rounded-lg p-3 border border-panel">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
          {t("sliders.designFocusTitle")}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {(["gameplay", "graphics", "sound", "tech"] as const).map((key) => {
            const value = designFocus[key];
            return (
              <div
                key={key}
                className="bg-card rounded-lg p-2.5 text-center"
              >
                <div className="text-xl leading-none mb-1">
                  {DESIGN_ICONS[key]}
                </div>
                <div className="text-xs text-gray-500">
                  {t(`sliders.${key}`)}
                </div>
                <div className="text-lg font-bold text-white">{value}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
