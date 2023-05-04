import { browser } from "$app/environment"; // sveltekit environment
import { writable } from "svelte/store";

import { setChannel } from "./chat";

export const twitchAppClientId = "h7vpg61dku6gdqpy2oefic8glbhzps"; // should this be stored in public git?

class CSRFToken {
  constructor() {
    this.key = "not-chat-vote.csrf";
    this.token = "token";

    if (browser) {
      this.token = localStorage.getItem(this.key) || this.generateNewToken();
    }
  }

  generateNewToken() {
    this.token = String(Math.random()).slice(2).padEnd(10, "0");
    localStorage.setItem(this.key, this.token);
    return this.token;
  }

  checkToken(t) {
    return t === this.token;
  }
}
export const requestToken = new CSRFToken();

export const auth = writable({});
const lsKey_auth = "not-chat-vote.twitch";

let baseAuth = {
  channel: "",
  access_token: null,
  type: null,
  scope: null,
  busy: true,
  valid: false,
};

try {
  if (!browser) throw new Error("Not a browser, no localStorage");
  const storedSettings = JSON.parse(localStorage.getItem(lsKey_auth));
  baseAuth = Object.assign(baseAuth, storedSettings);
  baseAuth.valid = false; // we must revalidate the token!
} catch (e) {
  console.warn("Failed to parse stored settings", e);
} finally {
  // various function which depend on being run after settings loaded
  auth.set(baseAuth);
  // automatically store settings:
  auth.subscribe((v) => {
    // store into localstorage
    if (browser) localStorage.setItem(lsKey_auth, JSON.stringify(v));
  });
}

// token validation
export function doTokenValidation() {
  if (!browser || !baseAuth.token) return;

  auth.update((a) => {
    a.busy = true;
    return a;
  });

  window
    .fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "OAuth " + baseAuth.token,
      },
      method: "GET",
    })
    .then((r) => {
      if (r.status !== 200) throw new Error(r.status);
      return r.json();
    })
    .then((data) => {
      baseAuth.channel = data.login;
      baseAuth.user_id = data.user_id;
      baseAuth.expires = data.expires_in;
      baseAuth.valid = true;
    })
    .catch((err) => {
      console.error("Token validation failed", err);
      baseAuth.channel = "";
      delete baseAuth.user_id;
      baseAuth.valid = false;
    })
    .finally(() => {
      baseAuth.busy = false;
      setChannel(baseAuth.channel, baseAuth.valid);
      auth.set(baseAuth); // trigger reactivity
    });
}

export function doUserAuth(token) {
  if (!browser) return;

  baseAuth.token = token;
  if (!token) {
    // token validation will pass through with no actual work
    baseAuth.valid = false;
    auth.set(baseAuth); // trigger reactivity
  }
  return doTokenValidation();
}

export function initTwitch() {
  if (!baseAuth.token) {
    auth.update((a) => {
      a.busy = false;
      return a;
    });
    return;
  }
  return doTokenValidation();
}
