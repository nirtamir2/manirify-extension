import { EmojiData } from "./emojiData.ts";

// Types
interface Emoji {
  id: string;
  name: string;
  skins: Array<{ native: string }>;
}

interface StorageData {
  whitelist: string[];
  blacklist: string[];
}

interface LicenseResponse {
  isLicensed: boolean;
}

// Constants
const DEFAULT_BLACKLIST = [
  "github.com",
  "slack.com",
  "discord.com",
  "upwork.com",
];
const MAX_SUGGESTIONS = 5;

// State
let emojiList: Emoji[] = [];
let isDropdownVisible = false;
let currentSelectedIndex = 0;
let currentColonIndex = -1;
let activeElement: HTMLElement | null = null;
let dropdown: HTMLDivElement;

// Initialize emoji data
const initializeEmojiList = (emojiData: EmojiData): void => {
  console.log("Initializing emoji list");
  try {
    if (!emojiData?.emojis) {
      console.error("Unexpected emoji data structure:", emojiData);
      return;
    }

    emojiList = Object.values(emojiData.emojis)
      .filter((emoji) => emoji.id && emoji.name && emoji.skins?.[0]?.native)
      .map((emoji) => ({
        id: emoji.id,
        name: emoji.name.toLowerCase(),
        skins: emoji.skins,
      }));

    console.log(`Processed ${emojiList.length} emojis`);
  } catch (error) {
    console.error("Error initializing emoji list:", error);
  }
};

// UI Components
const createDropdown = (): HTMLDivElement => {
  const dropdown = document.createElement("div");
  dropdown.id = "emoji-autocomplete-dropdown";
  dropdown.style.cssText = `
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

  const style = document.createElement("style");
  style.textContent = `
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

  document.head.appendChild(style);
  document.body.appendChild(dropdown);
  return dropdown;
};

const createPaywallPrompt = (): void => {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f3ead9;
    border: 1px solid #b0a591;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 300px;
    font-family: Arial, sans-serif;
  `;

  container.innerHTML = `
    <h3 style="font-size: 28px; line-height: 1.2; margin-top: 0; color: #333;">Unlock Emoji Autocomplete! 😃</h3>
    <p style="margin-bottom: 10px; color: #666; font-size: 16px; line-height: 1.2;">
      Enjoy Slack-style emoji shortcuts across the entire web. 
      Boost your expressiveness with just a few keystrokes!
    </p>
    <a id="emoji-purchase-btn"
      href="https://flyingfridgedigital.lemonsqueezy.com/buy/44c2fd9e-aaea-4511-b3d6-2b68869363dd"
      target="_blank" 
      style="background-color: #4CAF50;
      color: white;
      border: 1px solid #38813b;
      padding: 10px 15px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    ">Purchase Now →</a>
    <button id="emoji-close-btn" style="
      background-color: transparent;
      color: #666;
      border: none;
      padding: 5px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      margin: 4px 2px;
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 5px;
    ">✕</button>
  `;

  document.body.appendChild(container);
  document.getElementById("emoji-close-btn")?.addEventListener("click", () => {
    container.style.display = "none";
  });
};

// Helper Functions
const hideDropdown = (): void => {
  dropdown.style.display = "none";
  isDropdownVisible = false;
  currentSelectedIndex = 0;
};

const updateSelectedOption = (index: number): void => {
  const options = dropdown.querySelectorAll(".emoji-option");
  options.forEach((option, i) => {
    if (i === index) {
      option.classList.add("selected");
      option.scrollIntoView({ block: "nearest" });
    } else {
      option.classList.remove("selected");
    }
  });
  currentSelectedIndex = index;
};

const insertEmoji = (emoji: string, startIndex: number): void => {
  if (!activeElement) return;

  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    const endIndex = activeElement.selectionEnd || 0;
    activeElement.value =
      activeElement.value.substring(0, startIndex) +
      emoji +
      activeElement.value.substring(endIndex);
    activeElement.selectionStart = activeElement.selectionEnd =
      startIndex + emoji.length;
    activeElement.focus();
  } else if (activeElement.isContentEditable) {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent || "";
      const beforeText = text.substring(0, startIndex);
      const afterText = text.substring(range.startOffset);
      textNode.textContent = beforeText + emoji + afterText;

      const newPosition = startIndex + emoji.length;
      range.setStart(textNode, newPosition);
      range.setEnd(textNode, newPosition);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  hideDropdown();
};

// Event Handlers
const handleInput = (event: Event): void => {
  const target = event.target as HTMLElement;

  if (
    !(
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLInputElement ||
      target.isContentEditable
    )
  ) {
    return;
  }

  activeElement = target;
  let cursorPosition: number;
  let textBeforeCursor: string;

  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement
  ) {
    cursorPosition = target.selectionStart || 0;
    textBeforeCursor = target.value.substring(0, cursorPosition);
  } else {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(
      range.startContainer.parentElement || document.body,
    );
    clonedRange.setEnd(range.endContainer, range.endOffset);
    textBeforeCursor = clonedRange.toString();
    cursorPosition = textBeforeCursor.length;
  }

  const colonMatch = textBeforeCursor.match(/:(\w+)$/);
  if (!colonMatch) {
    hideDropdown();
    currentColonIndex = -1;
    return;
  }

  const searchTerm = colonMatch[1].toLowerCase();
  currentColonIndex = cursorPosition - colonMatch[0].length;

  const matchingEmojis = emojiList
    .filter(
      (emoji) =>
        emoji.name.includes(searchTerm) || emoji.id.includes(searchTerm),
    )
    .slice(0, MAX_SUGGESTIONS);

  if (matchingEmojis.length === 0) {
    hideDropdown();
    return;
  }

  const rect = target.getBoundingClientRect();
  showDropdown(
    window.pageXOffset + rect.left,
    window.pageYOffset + rect.bottom,
    matchingEmojis,
  );
};

const showDropdown = (x: number, y: number, emojis: Emoji[]): void => {
  dropdown.innerHTML = emojis
    .map(
      (emoji, index) => `
      <div class="emoji-option ${index === 0 ? "selected" : ""}" 
           data-emoji="${emoji.skins[0].native}" 
           data-index="${index}">
        ${emoji.skins[0].native} :${emoji.id}:
      </div>
    `,
    )
    .join("");

  dropdown.style.visibility = "hidden";
  dropdown.style.display = "block";

  const dropdownRect = dropdown.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const exceedsBottom = y + dropdownRect.height > viewportHeight;
  const exceedsRight = x + dropdownRect.width > viewportWidth;

  const finalY = exceedsBottom ? y - dropdownRect.height - 10 : y;
  const finalX = exceedsRight ? viewportWidth - dropdownRect.width - 10 : x;

  dropdown.style.left = `${finalX}px`;
  dropdown.style.top = `${finalY}px`;
  dropdown.style.visibility = "visible";

  isDropdownVisible = true;
  currentSelectedIndex = 0;

  const options = dropdown.querySelectorAll(".emoji-option");
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      const emoji = (e.target as HTMLElement).getAttribute("data-emoji");
      if (emoji && currentColonIndex !== -1) {
        insertEmoji(emoji, currentColonIndex);
      }
    });

    option.addEventListener("mouseover", (e) => {
      const index = parseInt(
        (e.target as HTMLElement).getAttribute("data-index") || "0",
      );
      updateSelectedOption(index);
    });
  });
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (!isDropdownVisible) return;

  const options = dropdown.querySelectorAll(".emoji-option");

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      event.stopPropagation();
      updateSelectedOption((currentSelectedIndex + 1) % options.length);
      break;

    case "ArrowUp":
      event.preventDefault();
      event.stopPropagation();
      updateSelectedOption(
        (currentSelectedIndex - 1 + options.length) % options.length,
      );
      break;

    case "Enter":
      event.preventDefault();
      event.stopPropagation();
      const emoji = options[currentSelectedIndex].getAttribute("data-emoji");
      if (emoji && currentColonIndex !== -1) {
        insertEmoji(emoji, currentColonIndex);
      }
      break;

    case "Escape":
      event.preventDefault();
      hideDropdown();
      break;
  }
};

// Initialization
export const initialize = (emojiData: EmojiData): void => {
  initializeEmojiList(emojiData);

  const styleLink = document.createElement("link");
  styleLink.href = chrome.runtime.getURL("styles.css");
  styleLink.type = "text/css";
  styleLink.rel = "stylesheet";
  (document.head || document.documentElement).appendChild(styleLink);

  dropdown = createDropdown();

  document.addEventListener("input", handleInput, true);
  document.addEventListener("keydown", handleKeydown, true);
  document.addEventListener(
    "click",
    (event) => {
      if (isDropdownVisible && !dropdown.contains(event.target as Node)) {
        hideDropdown();
      }
    },
    true,
  );
};

// Main
export const main = (): void => {
  chrome.runtime.sendMessage(
    { action: "checkLicense" },
    (response: LicenseResponse | undefined) => {
      if (chrome.runtime.lastError) {
        console.error("Error checking license:", chrome.runtime.lastError);
        createPaywallPrompt();
        return;
      }

      if (!response?.isLicensed) {
        console.log("Extension not licensed. Features disabled.");
        createPaywallPrompt();
        return;
      }

      chrome.storage.sync.get(
        ["whitelist", "blacklist"],
        (data: StorageData) => {
          const currentHost = window.location.hostname;
          const whitelist = data.whitelist || [];
          const blacklist = data.blacklist || [];

          if (blacklist.length === 0) {
            chrome.storage.sync.set({ blacklist: DEFAULT_BLACKLIST });
          }

          const isWhitelisted =
            whitelist.length > 0
              ? whitelist.some((domain) => currentHost.includes(domain))
              : !blacklist.some((domain) => currentHost.includes(domain));

          if (isWhitelisted) {
            import("./emojiData").then(({ default: emojiData }) => {
              initialize(emojiData);
            });
          }
        },
      );
    },
  );
};

// main();
