import { render } from "solid-js/web";
import App from "./App.tsx";
import { initialize } from "./content-script.ts";
import "./style.css";

function getCaretPosition(target: HTMLElement): number {
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement
  ) {
    return target.selectionStart || 0;
  } else if (target.isContentEditable) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const { startContainer, startOffset } = range;
      if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text;
        return startOffset;
      }
    }
  }
  return 0;
}

function getInputText(target: HTMLElement, caretPosition: number): string {
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement
  ) {
    return target.value.substring(0, caretPosition);
  } else if (target.isContentEditable) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const { startContainer } = range;
      if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text;
        return textNode.textContent?.substring(0, caretPosition) || "";
      }
    }
  }
  return "";
}

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    import("./emojiData").then(({ default: emojiData }) => {
      initialize(emojiData);
    });
    return;

    const [coodrinates, setCoordinates] = createSignal([]);
    const [isVisible, setIsVisible] = createSignal(false);

    function handleInput(event: InputEvent) {
      setIsVisible(true);
      const target = event.target;
      console.log("target", target.value);
      target.style.anchorName = "--active-input";
      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement ||
        target.isContentEditable
      ) {
        const caretPosition = getCaretPosition(target);
        const text = getInputText(target, caretPosition);
        const match = text.match(/:(\w+)$/);
        if (match) {
          const prefix = match[0];
          const query = match[1];
          if (query.length > 0) {
            const rect = target.getBoundingClientRect();
            setCoordinates([
              rect.left + window.pageXOffset,
              rect.bottom + window.pageYOffset,
              query,
            ]);
          } else {
            setIsVisible(false);
            // hideEmojiDropdown();
          }
        } else {
          setIsVisible(false);
          // hideEmojiDropdown();
        }
      }
    }

    document.addEventListener("input", handleInput);

    const ui = await createShadowRootUi(ctx, {
      name: "manirify-extension",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        const unmount = render(() => {
          return (
            <>
              IsVisible? {isVisible() ? "TRUE" : "FALSE"}
              Coor: {JSON.stringify(coodrinates())}
              <input type="text" value={5} />
              <App
                isVisible={isVisible()}
                x={coodrinates()[0]}
                y={coodrinates()[1]}
                value={coodrinates()[2]}
              />
            </>
          );
        }, container);
        return unmount;
      },
      onRemove: (unmount) => {
        setIsVisible(false);
        unmount?.();
      },
    });

    ui.mount();
  },
});
