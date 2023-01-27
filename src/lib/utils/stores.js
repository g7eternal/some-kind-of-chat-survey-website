import { browser } from '$app/environment' // sveltekit environment 
import { writable } from "svelte/store";
import { showAdviceFriend } from "./adviceFriend";

// for use in get/setContext
export const contextKey = Symbol();

/* TWITCH CONTROLLER */
const localChat = {
  channel: "",
  busy: true,
  connected: false,
};
export const chat = writable(localChat);

/* SETTINGS */
export const settings = writable({});
const lsKey_Settings = "not-chat-vote.settings";

let baseSettings = {
  channel: "",
  hideVotes: false,
  hideAvatars: false,
  suggestCommand: "!suggest",
  voteCommand: "!vote",
  raffleCommand: "!join",
  firstLogin: true,
  firstVisit: true
};

try {
  if (!browser) throw new Error("Not a browser, no localStorage");
  const storedSettings = JSON.parse(localStorage.getItem(lsKey_Settings));
  baseSettings = Object.assign(baseSettings, storedSettings);
} catch (e) {
  console.warn("Failed to parse stored settings", e);
} finally { // various function which depend on being run after settings loaded
  settings.set(baseSettings);
  // check if user is a first timer:
  if (baseSettings.firstVisit) {
    showAdviceFriend(
      `Before you start a poll, use <b style="color:#aa77ff">Login</b> button to connect to Twitch.`,
      "Welcome!"
    );
    baseSettings.firstVisit = false;
    settings.set(baseSettings);
  }
}

// automatically store settings
settings.subscribe(v => {
  // store into localstorage
  if (browser) localStorage.setItem(lsKey_Settings, JSON.stringify(v));
});
