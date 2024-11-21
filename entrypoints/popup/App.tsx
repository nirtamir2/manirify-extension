import "~/assets/tailwind.css";
import "./App.css";

export function App() {
  return (
    <div>
      <Show
        when={window.ai}
        fallback={
          <div class="text-red-500">Browser AI is not supported ✖︎</div>
        }
      >
        <div class="text-green-500">The app uses AI ✅</div>
      </Show>
      <div>
        To start press <code>:</code> on every text field and try
      </div>
    </div>
  );
}
