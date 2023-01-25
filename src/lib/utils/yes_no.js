import { writable } from "svelte/store";
import { Poll } from "./poll";
import { addHook, removeHook } from "./twitch";

const yes = ["yes", "voteyea"];
const no  = [ "no", "votenay"];
const YES = "YEA", NO = "NAY";
yes.push(YES.toLowerCase()); 
no.push(NO.toLowerCase());

class YesNoPoll extends Poll {
  constructor (...args) {
    super(...args);
    this.yes_no = true;

    // add two entries:
    const y = this.addEntry(
      { "render-name": "" },
      YES
    );
    this.entries.delete(y.id);
    y.id = YES;
    y.renderText = `<div class="tw-circle voteyea">YEA</div>`;
    this.entries.set(y.id, y);
    
    const n = this.addEntry(
      { "render-name": "" },
      NO
    );
    this.entries.delete(n.id);
    n.id = NO;
    n.renderText = `<div class="tw-circle votenay">NAY</div>`;
    this.entries.set(n.id, n);

    // replace hook:
    removeHook(this._hook);
    this._hook = (tags, message) => {
      // Voting process
      if (this.allowVote) {
        if (this.voters.has(tags.username)) return;

        const lcase = message.toLowerCase().split(/\s/);
        let voted = false;

        if (yes.some(matcher => lcase.includes(matcher))) {
          const entry = this.entries.get(YES);
          entry.incScore(1);
          voted = true;
        }
        if (no.some(matcher => lcase.includes(matcher))) {
          const entry = this.entries.get(NO);
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
    };
    addHook(this._hook);
  }

  startVoting () {
    super.startVoting();
    triggerPollReactivity();
    return this;
  }
  stopVoting () {
    super.stopVoting();
    triggerPollReactivity();
    return this;
  }
}

const yesNoPollEntity = new YesNoPoll();
export const yesNoPoll = writable(yesNoPollEntity);

function triggerPollReactivity () { 
  yesNoPoll.set(yesNoPollEntity);
}