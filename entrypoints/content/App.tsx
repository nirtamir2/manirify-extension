import "~/assets/tailwind.css";
import solidLogo from "@/assets/solid.svg";
import "./App.css";
import { getAIEmojiFromText } from "./getAIEmojiFromText";


function App(props: {
  value: string;
  x: number;
  y: number;
  isVisible: boolean;
}) {
  // function handleInput(e: Event) {
  //   console.log(e.currentTarget.value);
  // }
  //
  // document.addEventListener("input", (a) => handleInput);
  // document.addEventListener("textarea", (a) => handleInput);
  //
  // onCleanup(() => {
  //   document.addEventListener("input", handleInput);
  //   document.addEventListener("textarea", handleInput);
  // });

  const [data2, { refetch }] = createResource(getAIEmojiFromText);

  createEffect(() => {
      refetch(props.value);
  });

  return (
    // <Show when={props.isVisible}>
    <div
      id={"aa"}
      style={{
        // "position-anchor": "--active-input",
        // top: "anchor(bottom)",
        "z-index": "1",
        position: "fixed",
        top: `${props.y}px`,
        left: `${props.x}px`,
      }}
    >
      <img src={solidLogo} class="logo solid" alt="Solid logo" />
      <div>value = {props.value}</div>
      <div>AI EMOJI = {data2()}!! {data2.state}</div>
      <div>x ={props.x}</div>
      <div>y ={props.y}</div>
    </div>
    // </Show>
  );
}

export default App;
