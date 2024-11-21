import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    permissions: ["aiLanguageModelOriginTrial"],
    trial_tokens: [
      "ApQdzvh4361CLQYNla9D/0DdsPOyiiNCg41gzHnVeAo2PsYluuUnf+dCxUtzhrlBtX4pab85WnZq5LDs+z0ouA4AAAB4eyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZmdja2ZrampjZ25pY29qb2hnY2Fnb2dnZm9mY2VkbWsiLCJmZWF0dXJlIjoiQUlQcm9tcHRBUElGb3JFeHRlbnNpb24iLCJleHBpcnkiOjE3NjA0ODYzOTl9",
    ],
  },
  modules: ["@wxt-dev/module-solid"],
});
