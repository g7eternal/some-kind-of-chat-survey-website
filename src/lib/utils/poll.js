import { writable } from "svelte/store";
import { settings, chat } from "./stores";
import { addHook, removeHook } from "./chat";
import { parseMessage } from "./misc";

const HIDE_SCORE = `<i class="opacity-50">[hidden]</i>`;

let chatConnected = false;
chat.subscribe((c) => {
  chatConnected = c.connected;
});

export const chatOptions = {
  suggestCmd: "!suggest",
  voteCmd: "!vote",
  raffleCmd: "!join",
  scoreVisibility: true,
};

let pollCounter = 0; // counter (key) for polls - multipoll support?

class PollEntry {
  // element in poll to be voted on
  constructor(id, tags, message) {
    this.id = id;

    this.username = tags.username;
    this.usercolor = tags.color || "white";
    this.author = tags["display-name"] || tags.username;
    this.renderName =
      tags["render-name"] || `<span style="color:${this.usercolor}">${this.author}</span>`;

    this.rawText = tags.rawText || message;
    this.text = message;
    this.lowerText = this.text.toLowerCase();

    this.renderText = parseMessage(this.text);

    this.color = [
      // rgb palette
      Math.floor(80 + Math.random() * 99),
      Math.floor(80 + Math.random() * 99),
      Math.floor(80 + Math.random() * 99),
    ];
    this.bgcolor = `rgba(${this.color.join(",")}, 0.2)`;
    this.bordercolor = `rgba(${this.color.join(",")}, 1)`;

    this.isScoreVisible = chatOptions.scoreVisibility;
    this.setScore(0);
  }

  incScore() {
    return this.setScore(this.score + 1);
  }
  setScore(score) {
    this.score = score;
    return this.updateRenderScore();
  }
  updateRenderScore() {
    this.renderScore = this.isScoreVisible ? this.score : HIDE_SCORE;
    return this;
  }

  updateScoreVisibility(isVisible) {
    if (isVisible === undefined) isVisible = !this.isScoreVisible;
    // changes rendered value in table view
    this.isScoreVisible = isVisible;
    return this.updateRenderScore();
  }
}

export class Poll {
  // container - list of poll entries
  constructor(type = "poll") {
    this.id = ++pollCounter;
    this.type = type;
    this.entryCounter = 0; // inner counter (key for entries)

    this.entries = new Map();
    this.voters = new Set();
    this.suggestors = new Set();
    this.winner = null;

    this.allowVote = false;
    this.allowSuggest = false;

    this.activate();
  }

  activate() {
    this._hook = (tags, message = "", lcase) => {
      // Voting process
      if (this.allowVote && lcase[0] === chatOptions.voteCmd) {
        if (this.voters.has(tags.username)) return;
        let voted = false;

        // increase score of poll entries
        for (let i = 1; i < lcase.length; i++) {
          const id = parseInt(lcase[i], 10);
          if (!this.entries.has(id)) continue;

          const entry = this.entries.get(id);
          entry.incScore(1);
          voted = true;
        }

        // store voter info
        if (voted) {
          this.voters.add(tags.username);
          triggerPollReactivity();
        }
        return;
      }

      // Suggestions
      if (this.allowSuggest && lcase[0] === chatOptions.suggestCmd) {
        // if (this.suggestors.has(tags.username)) return; // todo: make an option to disallow more than one suggestion

        const slicedText = message.slice(chatOptions.suggestCmd.length).trim();
        tags.rawText = message;

        if (this.findDuplicateEntry(slicedText)) return; // duplicate suggestion
        this.addEntry(tags, slicedText);
        return;
      }
    };
    addHook(this._hook);

    return this;
  }

  reset() {
    this.entries.forEach((entry) => {
      entry.setScore(0);
    });
    this.suggestors.clear();
    this.voters.clear();
    this.winner = null;
    return this.stopVoting();
  }

  addEntry(user, message) {
    const entry = new PollEntry(++this.entryCounter, user, message);
    this.entries.set(entry.id, entry);
    triggerPollReactivity();
    return entry;
  }

  removeEntryById(id, updateIndexes = false) {
    if (!this.entries.has(id)) return false;
    this.entries.delete(id);

    if (updateIndexes) {
      let newCounter = 0;
      const newEntriesList = new Map();
      this.entries.forEach((entry) => {
        entry.id = ++newCounter;
        newEntriesList.set(entry.id, entry);
      });
      this.entries = newEntriesList;
    }

    triggerPollReactivity();
    return true;
  }

  startVoting(skipSizeCheck = false) {
    if (!chatConnected) throw new Error("You are not connected to Twitch!");
    if (!skipSizeCheck && this.entries.size < 2)
      throw new Error("Poll should have at least 2 items to choose from.");
    this.allowSuggest = false;
    this.allowVote = true;
    triggerPollReactivity();
    return this;
  }
  stopVoting() {
    this.allowVote = false;
    triggerPollReactivity();
    return this;
  }

  allowSuggestions() {
    if (!chatConnected) throw new Error("You are not connected to Twitch!");
    this.allowVote = false;
    this.allowSuggest = true;
    triggerPollReactivity();
    return this;
  }
  blockSuggestions() {
    this.allowSuggest = false;
    triggerPollReactivity();
    return this;
  }

  getWinner() {
    this.stopVoting().blockSuggestions();

    let winner = null;
    this.entries.forEach((entry) => {
      if (!winner || winner.score < entry.score) {
        winner = entry;
      }
    });
    if (winner?.score < 1) winner = null;

    this.winner = winner;
    triggerPollReactivity();
    return this.winner;
  }

  findDuplicateEntry(text) {
    let found = null;
    this.entries.forEach((entry) => {
      if (entry.lowerText === text) found = entry;
    });

    return found;
  }

  destroy() {
    this.stopVoting().blockSuggestions();
    removeHook(this._hook);
  }
}

export function hardReset() {
  pollEntity.destroy();

  pollEntity = new Poll();
  poll.set(pollEntity);

  return pollEntity;
}

// exports an instance of poll - maybe multipoll support in the future
let pollEntity = new Poll();
export const poll = writable(pollEntity);

/* 
  reactivity is triggered only if first level props are changed
  props of types like Maps and Sets are harder - we should trigger reaction manually if any of those are edited
*/
function triggerPollReactivity() {
  poll.set(pollEntity);
}

// react to settings being updated:
settings.subscribe((v) => {
  // update command trigger text
  chatOptions.suggestCmd = v.suggestCommand.toLowerCase();
  chatOptions.voteCmd = v.voteCommand.toLowerCase();
  chatOptions.raffleCmd = v.raffleCommand.toLowerCase();
  // update score visibility
  chatOptions.scoreVisibility = !v.hideVotes;
  pollEntity.entries.forEach((e) => e.updateScoreVisibility(chatOptions.scoreVisibility));
  triggerPollReactivity();
});
