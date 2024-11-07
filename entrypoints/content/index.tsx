import { render } from "solid-js/web";
import App from "./App.tsx";
import "./style.css";


export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        const unmount = render(() => <App />, container);
        return unmount;
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount?.();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
