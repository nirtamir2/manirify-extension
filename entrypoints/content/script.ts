import { emoji } from "@/manirify-extension/entrypoints/content/emoji.ts";

const BLACKLIST_DOMAINS = [
  "github.com",
  "slack.com",
  "discord.com",
  "upwork.com",
];

interface Emoji {
  id: string;
  name: string;
  skins: Array<{ native: string }>;
}

function stuff() {
  const BLACKLIST_DOMAINS = [
    "github.com",
    "slack.com",
    "discord.com",
    "upwork.com",
  ];

  interface Emoji {
    id: string;
    name: string;
    skins: Array<{ native: string }>;
  }

  const emojiData: { emojis: Record<string, Emoji> } = emoji;
  const emojis: Emoji[] = [];

  let selectedIndex = 0;

  function initialize() {
    if (Object.values(emojiData.emojis).length > 0) {
      for (const emoji of Object.values(emojiData.emojis)) {
        if (
          emoji.id &&
          emoji.name &&
          emoji.skins &&
          emoji.skins[0] &&
          emoji.skins[0].native
        ) {
          emojis.push({
            id: emoji.id,
            name: emoji.name.toLowerCase(),
            skins: emoji.skins,
          });
        }
      }
      console.log(`Processed ${emojis.length} emojis`);
    } else {
      console.error("Unexpected emoji data structure:", emojiData);
    }

    createEmojiDropdownElement();
  }

  function createEmojiDropdownElement() {
    const dropdownElement = document.createElement("div");
    dropdownElement.id = "emoji-autocomplete-dropdown";
    dropdownElement.style.cssText = `
    position: fixed;
    z-index: 2147483647;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    max-height: 200px;
    overflow-y: auto;
    padding: 4px;
    min-width: 200px;
    backdrop-filter: blur(8px);
    transition: opacity 0.1s ease-in-out;
  `;

    const styleElement = document.createElement("style");
    styleElement.textContent = `
    #emoji-autocomplete-dropdown .emoji-option {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.1s ease-in-out;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #emoji-autocomplete-dropdown .emoji-option:hover,
    #emoji-autocomplete-dropdown .emoji-option.selected {
        background-color: rgba(0, 0, 0, 0.05);
    }

    #emoji-autocomplete-dropdown .emoji-option.selected {
        background-color: rgba(0, 0, 0, 0.08);
    }
  `;

    document.head.appendChild(styleElement);
    document.body.appendChild(dropdownElement);
  }

  function showEmojiDropdown(x: number, y: number, filteredEmojis: Emoji[]) {
    const dropdownElement = document.getElementById(
      "emoji-autocomplete-dropdown",
    );
    if (dropdownElement) {
      dropdownElement.innerHTML = filteredEmojis
        .map(
          (emoji, index) =>
            `<div class="emoji-option ${index === 0 ? "selected" : ""}" data-emoji="${
              emoji.skins[0].native
            }" data-index="${index}">${emoji.skins[0].native} :${emoji.id}:</div>`,
        )
        .join("");

      dropdownElement.style.left = `${x}px`;
      dropdownElement.style.top = `${y}px`;
      dropdownElement.style.display = "block";

      selectedIndex = 0;
      updateSelectedOption(selectedIndex);
    }
  }

  function updateSelectedOption(index: number) {
    const dropdownElement = document.getElementById(
      "emoji-autocomplete-dropdown",
    );
    if (dropdownElement) {
      const options =
        dropdownElement.querySelectorAll<HTMLElement>(".emoji-option");
      options.forEach((option, i) => {
        if (i === index) {
          option.classList.add("selected");
          option.scrollIntoView({ block: "nearest" });
        } else {
          option.classList.remove("selected");
        }
      });
    }
  }

  function hideEmojiDropdown() {
    const dropdownElement = document.getElementById(
      "emoji-autocomplete-dropdown",
    );
    if (dropdownElement) {
      dropdownElement.style.display = "none";
    }
  }

  function handleInput(event: InputEvent) {
    const target = event.target;
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
        const query = match[1].toLowerCase();
        const filteredEmojis = emojis.filter(
          (emoji) => emoji.name.includes(query) || emoji.id.includes(query),
        );
        if (filteredEmojis.length > 0) {
          const rect = target.getBoundingClientRect();
          showEmojiDropdown(
            rect.left + window.pageXOffset,
            rect.bottom + window.pageYOffset,
            filteredEmojis,
          );
        } else {
          hideEmojiDropdown();
        }
      } else {
        hideEmojiDropdown();
      }
    }
  }

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

  function insertEmoji(
    emoji: string,
    caretPosition: number,
    target: HTMLElement,
  ) {
    if (
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLInputElement ||
      target.isContentEditable
    ) {
      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement
      ) {
        const currentText = target.value;
        target.value =
          currentText.substring(0, caretPosition) +
          emoji +
          currentText.substring(caretPosition);
        target.selectionStart = target.selectionEnd =
          caretPosition + emoji.length;
      } else {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(emoji));
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      target.focus();
    }
  }

  function handleDropdownClick(event: MouseEvent) {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const emoji = target.getAttribute("data-emoji");
      if (emoji && currentTarget) {
        const caretPosition = getCaretPosition(currentTarget);
        insertEmoji(emoji, caretPosition, currentTarget);
        hideEmojiDropdown();
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const dropdownElement = document.getElementById(
      "emoji-autocomplete-dropdown",
    );
    if (dropdownElement && dropdownElement.style.display === "block") {
      const options =
        dropdownElement.querySelectorAll<HTMLElement>(".emoji-option");
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          selectedIndex = (selectedIndex + 1) % options.length;
          updateSelectedOption(selectedIndex);
          break;
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          selectedIndex = (selectedIndex - 1 + options.length) % options.length;
          updateSelectedOption(selectedIndex);
          break;
        case "Enter":
          event.preventDefault();
          const selectedEmoji =
            options[selectedIndex].getAttribute("data-emoji");
          if (selectedEmoji) {
            const caretPosition = getCaretPosition(event.target as HTMLElement);
            insertEmoji(
              selectedEmoji,
              caretPosition,
              event.target as HTMLElement,
            );
          }
          break;
        case "Escape":
          event.preventDefault();
          hideEmojiDropdown();
          break;
      }
    }
  }

  function main() {
    initialize();

    document.addEventListener("input", handleInput, true);
    document.addEventListener("keydown", handleKeydown, true);
    document.addEventListener("click", handleDropdownClick, true);

    document.addEventListener(
      "click",
      (event) => {
        const dropdownElement = document.getElementById(
          "emoji-autocomplete-dropdown",
        );
        if (
          dropdownElement &&
          dropdownElement.style.display === "block" &&
          !dropdownElement.contains(event.target as Node)
        ) {
          hideEmojiDropdown();
        }
      },
      true,
    );
  }

  main();
}
