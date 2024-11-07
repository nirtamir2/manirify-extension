import { createSignal } from "solid-js";
import "~/assets/tailwind.css";
import solidLogo from "@/assets/solid.svg";
import "./App.css";
import wxtLogo from "/wxt.svg";

function App() {
  const [count, setCount] = createSignal(0);
  return (
    <>
      <div class="bg-red-400" id="emoji-autocomplete-dropdown">
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} class="logo" alt="WXT logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>WXT + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>popup/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the WXT and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
