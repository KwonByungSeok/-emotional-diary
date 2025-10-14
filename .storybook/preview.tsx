import type { Preview } from "@storybook/nextjs-vite";
import { NextThemesProvider } from "../src/commons/providers/next-themes/next-themes.provider";
import "../src/app/globals.css";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#fafafa",
        },
        {
          name: "dark",
          value: "#0a0a0a",
        },
      ],
    },
  },

  decorators: [
    (Story) => (
      <NextThemesProvider>
        <Story />
      </NextThemesProvider>
    ),
  ],
};

export default preview;
