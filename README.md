# readme-vibe

a small interactive readme generator built with react and vite. the app guides users through a few steps (username, vibe selection, theme) and produces a preview that can be copied into a repository readme.

## features

- step-based ui for entering a username and selecting a vibe
- live preview of the generated readme
- custom theme builder for simple styling tweaks
- built with vite and react (jsx)

## built with

- vite
- react
- javascript

## getting started

clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/readme-vibe.git
cd readme-vibe
npm install
```

run the development server:

```bash
npm run dev
```

open the app at the address shown by vite (usually http://localhost:5173).

## usage

- enter a username or project name
- choose a vibe or tone for the readme
- tweak the theme if desired
- preview and copy the generated readme content

key source files:

- `src/generators.js` — core readme generation logic
- `src/github.js` — optional helpers for github data
- `src/components/Step1Username.jsx` — username step
- `src/components/Step2Vibe.jsx` — vibe selection
- `src/components/Step3Preview.jsx` — preview and copy UI
- `src/components/CustomThemeBuilder.jsx` — theme controls

## project structure

- `src/` — application source
- `public/` — static assets
- `package.json` — scripts and dependencies

## development

- linting and formatting are configured in the project. run the available npm scripts from `package.json`.
- to build for production:

```bash
npm run build
```

## contributing

pull requests and issues are welcome. keep changes focused and include tests or manual verification steps when appropriate.

## license

check `package.json` for license information or add a license file if you plan to make this project public.
