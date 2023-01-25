import tmi from "tmi.js";
import { showAdviceFriend } from "./adviceFriend.js";
import {settings, chat} from "./stores.js";

const hooks = []; // external message parsers
let channel = "";

const client = new tmi.Client({
  // connect options go here
});
client.connect().catch(console.error);

client.on("connected", () => {
  console.info("<TMI> Connection established!");
  if (!channel) {
    chat.update(c => { // show "login" button
      c.busy = false;
      c.connected = false;
      return c;
    });
  } else connect();
});

client.on("join", (channel, _username, self) => {
  if (self) console.log(`<TMI> Event: Joined chat room: ${channel}`);
});
client.on("part", (channel, _username, self) => {
  if (self) console.log(`<TMI> Event: Left chat room: ${channel}`);
});

client.on("disconnected", (reason) => {
  console.warn("<TMI> Disconnected. Reason: " + reason);
  disconnect().then(connect);
});

client.on('message', (_channel, tags, message) => {
  for (let i = 0; i < hooks.length; i++) {
    hooks[i](tags, message); // run callback with parser
  }
});

async function connect () {
  if (!channel) return void console.warn("<TMI> Connect refused: No channel provided");
  chat.update(c => {
    c.channel = channel;
    c.busy = true;
    return c;
  });
  // make join request
  try {
    await client.join(channel);
    console.info("<TMI> Joined channel: " + channel);
    chat.update(c => {
      c.busy = false;
      c.connected = true;
      return c;
    });
    // first time connection check:
    settings.update(v => {
      if (v.firstLogin) showAdviceFriend(
        "You can start polling now.<br>Add some entries using suggestions from chat or by yourself, then click <b class='text-success-emphasis'>Start voting</b> button to proceed.",
        "Nice!"
      );
      v.firstLogin = false;
      return v;
    });
  } catch (e) {
    console.warn("<TMI> Failed to join channel: " + channel, e);
    chat.update(c => {
      c.busy = false;
      c.connected = false;
      return c;
    });
    throw e;
  }
}

async function disconnect (force=false) {
  if (!force && !channel) return void console.warn("<TMI> Disconnect refused: No channel!");
  chat.update(c => {
    c.busy = true;
    // c.connected = true; // we actually can't be sure we are connected
    return c;
  });
  // make part request
  try {
    await client.part(channel);
    console.info("<TMI> Left channel: " + channel);
    chat.update(c => {
      c.busy = false;
      c.connected = false;
      return c;
    });
  } catch (e) {
    console.warn("<TMI> Failed to leave channel: " + channel, e);
    chat.update(c => {
      c.busy = false;
      // c.connected = false; // same shit as above
      return c;
    });
    throw e;
  }
}

export async function setChannel (newChannel="", doConnect=false) {
  if (channel && doConnect) await disconnect(true);

  channel = newChannel;
  settings.update(v => {
    v.channel = newChannel;
    return v;
  });

  if (doConnect && channel) await connect();
}

export async function addHook (callback) {
  hooks.push(callback);
}
export async function removeHook (callback) {
  const hookIndex = hooks.findIndex(h => h === callback);
  if (hookIndex < 0) return void console.trace("Invalid hook removal request: hook was not present!", callback);

  hooks.splice(hookIndex, 1);
}