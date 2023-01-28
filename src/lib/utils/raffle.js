import { writable } from "svelte/store";
import { Poll, chatOptions } from "./poll";
import { addHook, removeHook } from "./chat";
import { getAvatar } from "./userAvatars";
import { parseMessage } from "./misc";

class Raffle extends Poll {
  constructor (...args) {
    super("raffle", ...args);

    this.nextWinner = null;
    this.winnerCount = 0;
    this.winnerMessages = [];
    this.winnerHistory = new Map();

    // aliases
    this.entrants = this.voters;
    this.joiners = this.suggestors;

    // replace hook:
    removeHook(this._hook);
    this._hook = (tags, message, lcase) => {
      // Winner's message history
      if (tags.username === this.winner?.username) {
        this.winnerMessages.push(parseMessage(message));
        triggerPollReactivity();
        return;
      }

      // Joining process
      if (this.allowVote && lcase[0] === chatOptions.raffleCmd) {
        if (this.joiners.has(tags.username)) return;

        this.entrants.add(tags.username);
        this.joiners.add(tags.username);

        const newEntry = this.addEntry(tags, message);
        this.entries.delete(newEntry.id);
        this.entries.set(tags.username, newEntry);

        // pre-cache user image
        getAvatar(tags.username).then(link => {
          newEntry.imageCached = new Image();
          newEntry.imageCached.src = link;
        });
        
        triggerPollReactivity();
      }
    };
    addHook(this._hook);
  }

  startVoting () {
    super.startVoting(true);
    triggerPollReactivity();
    return this;
  }
  stopVoting () {
    super.stopVoting();
    triggerPollReactivity();
    return this;
  }

  allowEntering () {
    return this.startVoting();
  }
  blockEntering () {
    return this.stopVoting();
  }

  removeUser (username) {
    const result = this.entrants.delete(username);
    this.entries.delete(username);
    triggerPollReactivity();
    return result;
  }
  reset () {
    this.nextWinner = null;
    this.winnerCount = 0;
    this.winnerHistory.clear();
    this.entries.clear();
    return super.reset();
  }

  getWinner (winner) {
    if (!winner) { // may be passed by RaffleAnimation result function
      const userPool = Array.from(this.entrants.values());
      const winnerIndex = Math.floor(Math.random()*userPool.length);
      
      winner = userPool[winnerIndex] || null;
    }

    if (winner) {
      this.entrants.delete(winner);
      this.nextWinner = this.entries.get(winner);
      this.entries.delete(winner);
    } else {
      this.nextWinner = null;
    }

    triggerPollReactivity();
    return this.nextWinner;
  }
  acknowledgeWinner () {
    this.winner = this.nextWinner;
    if (this.winner) this.winner.winOrder = ++this.winnerCount;
    this.winnerHistory.set(this.winnerCount, this.winner);

    this.winnerMessages = [];
    if (this.nextWinner) this.nextWinner.messages = this.winnerMessages;

    triggerPollReactivity();
    return this.winner;
  }
}

const raffleEntity = new Raffle();
export const raffle = writable(raffleEntity);

function triggerPollReactivity () { 
  raffle.set(raffleEntity);
}