import { initialize } from "./content-script.ts";
import "./style.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(_ctx) {
    import("./emojiData").then(({ default: emojiData }) => {
      initialize(emojiData);
    });
  },
});
