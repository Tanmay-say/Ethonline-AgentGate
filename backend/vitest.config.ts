import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ["@scopelift/stealth-address-sdk"]
      }
    }
  }
});
