import type {Config} from "tailwindcss";

const config: Config = {
    content: ["assets/**", "entrypoints/**", "components/**"],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;