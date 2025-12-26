# React + TypeScript + Vite

This project is a React application built with Vite and TypeScript. It provides a minimal setup to get React working with Hot Module Replacement (HMR) and includes some basic ESLint rules for code quality.

## Getting Started

To get the project up and running, follow these steps:

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run in Development Mode:**

    ```bash
    npm run dev
    ```

    This will start the development server and open the application in your browser.

3.  **Build for Production:**

    ```bash
    npm run build
    ```

    This will compile the application for production, optimizing it for performance.

4.  **Preview Production Build:**
    ```bash
    npm run preview
    ```
    This command serves the production build locally for testing.

## Key Technologies

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite:** A fast build tool that provides an excellent development experience.

## Vite Plugins

## Assumptions & Trade-offs

- Assumed Supabase Auth would handle authentication and session management.
- Used client-side rendering for simplicity and faster development.
- Prioritized core user flows over edge-case handling due to time constraints.
- Limited error handling to common cases to keep the codebase clean.
- I prioritized core functionality over advanced animations due to time constraints.
- I did not implement unit tests due to time constraints.
- With more time, I would add comprehensive tests, improve accessibility, and optimize performance.

This project utilizes the following official Vite plugins for React:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)**: Uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh, enabling quick updates during development.
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)**: An alternative plugin that uses [SWC](https://swc.rs/) for even faster Fast Refresh. You can switch to this if you prefer.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
