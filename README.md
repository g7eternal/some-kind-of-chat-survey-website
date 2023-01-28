# some-kind-of-chat-survey-website

Wow, what a new and original idea of a website! Surely nobody has ever made this one before.

## How to setup

Here's a simple way to run app locally.

```bash
# install all dependencies
npm install

# run locally with debugging
npm run dev
```

Then follow the instructions from console. Most likely the app will be available at localhost:5173

> Note: Twitch integration will probably not work because of invalid client ID. Please consult [Twitch docs](https://dev.twitch.tv/docs/authentication/) on how to generate your own ID, then paste it into utils/twitch.js manually

## Developing

Suggested VS Code plugins:
* Svelte for VS Code
* ESLint
* GitLens
* maybe something else idk 💀

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

The static version of app will be available at `/build` after you run a build.
