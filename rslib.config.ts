import { defineConfig } from "@rslib/core";

export default defineConfig({
    source: {
        entry: {
            index: "./src/index.ts",
        },
    },
    output: {
        target: "node",
    },
    lib: [
        {   
            format: "esm",
            dts: {
                bundle: true,
            },
            syntax:"es2022"
        },
    ],
});
