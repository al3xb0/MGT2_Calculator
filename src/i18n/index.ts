import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";

const savedLanguage = localStorage.getItem("mgt2-language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
