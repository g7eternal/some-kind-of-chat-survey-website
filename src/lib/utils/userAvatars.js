import { auth, twitchAppClientId as token } from "./twitch";

const avatars = new Map();
const unknown = [];

let twitch = null;
auth.subscribe(a => {
  twitch = a;
});

let fetchTimer = null;
const rateLimit = {
  remaining: 1e3,
  reset: 0,
  heartbeat: 500  // how often will we be polling
};

export function getAvatar (username) {
  return new Promise((resolve, reject) => {
    try {
      
      const knownAvatar = avatars.get(username);
      if (knownAvatar) return resolve(knownAvatar);

      unknown.push(username);

      if (!fetchTimer) requestSomeAvatarsFromTwitch();

      const awaiter = setInterval(() => {
        if (avatars.has(username)) {
          clearInterval(awaiter);
          resolve(avatars.get(username));
        }
      }, rateLimit.heartbeat);

    } catch (e) {
      reject(e);
    }
  });
}


async function requestSomeAvatarsFromTwitch () {
  if (unknown.length < 1) {
    fetchTimer = null;
    return;
  }

  fetchTimer = true; // block potential second call from another getAvatar

  if (rateLimit.remaining > 0 || Date.now() > rateLimit.reset) {
    if (!twitch.valid) return; // no auth token!

    const candidates = [];
    while (unknown.length && candidates.length < 99) {
      candidates.push("login=" + encodeURIComponent(unknown.pop()));
    }
    
    try {
      const resp = await window.fetch(
        "https://api.twitch.tv/helix/users?" + candidates.join("&"),
        {
          headers: {
            "Client-Id": token,
            "Authorization": "Bearer " + twitch.token
          },
          method: "GET"
        }
      );

      if (resp.headers["Ratelimit-Remaining"]) {
        rateLimit.remaining = parseInt(response.headers["Ratelimit-Remaining"], 10);
      }
      if (resp.headers["Ratelimit-Reset"]) {
        rateLimit.reset = parseInt(response.headers["Ratelimit-Reset"], 10);
      }
      const response = await resp.json();

      if (!response.data) {
        console.warn("Avatars: Bad response", response);
        throw new Error("Avatars: No data");
      }

      response.data.forEach(user => {
        avatars.set(user.login, user.profile_image_url);
      });

    } catch (e) {
      console.warn("Failed to fetch avatars", e);
      rateLimit.remaining = Math.max(1, rateLimit.remaining); // todo: the limit is probably not affected if fetch didn't reach twitch servers
    } finally {
      // schedule a rerun
      fetchTimer = setTimeout(requestSomeAvatarsFromTwitch, rateLimit.heartbeat);
    }
  }
}