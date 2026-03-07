import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  sourceLocale: "en",
  locales: ["en", "zh-CN", "zh-TW"],
  catalogs: [
    {
      path: "locales/{locale}/messages",
      include: ["src"],
    },
  ],
};

export default config;
