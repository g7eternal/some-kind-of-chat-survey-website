import { writable } from "svelte/store";
import { Poll } from "./poll";
import { addHook, removeHook } from "./chat";

class RatingPoll extends Poll {
  constructor(...args) {
    super("rating", ...args);

    this._winHeader = "The final result is:";

    // max rating number
    this.rateFloor = 1;
    this.rateCeiling = 10;
    this.rating = 0;

    // replace hook:
    removeHook(this._hook);
    this._hook = (tags, message, lcase) => {
      // Voting process
      if (this.allowVote) {
        if (this.voters.has(tags.username)) return;

        const voteNumber = parseInt(lcase[0], 10);
        const voteEntry = this.entries.get(voteNumber);

        if (voteEntry) {
          voteEntry.incScore(1);
          this.voters.add(tags.username);
          this.updateRating();
        }

        return;
      }
    };
    addHook(this._hook);

    this.reset(true);
  }

  reset(firstTime = false) {
    this.rating = 0;

    this.entries.clear();
    if (this.rateCeiling < this.rateFloor) this.rateCeiling = this.rateFloor;

    for (let i = this.rateFloor; i < this.rateCeiling + 1; i++) {
      const stringEntry = String(i);

      const ratingEntry = this.addEntry({ "render-name": "" }, stringEntry);
      this.entries.delete(ratingEntry.id);
      ratingEntry.id = i;
      ratingEntry.renderText = stringEntry;
      this.entries.set(ratingEntry.id, ratingEntry);
    }

    this.suggestors.clear();
    this.voters.clear();
    this.winner = null;
    return this.stopVoting(!firstTime);
  }

  updateRating() {
    let weightedSum = 0,
      totalCount = 0;
    this.entries.forEach((e) => {
      weightedSum += e.score * e.id;
      totalCount += e.score;
    });

    this.rating = weightedSum / totalCount;

    triggerPollReactivity();
    return this;
  }

  startVoting() {
    super.startVoting(true);
    triggerPollReactivity();
    return this;
  }
  stopVoting(react = true) {
    super.stopVoting();
    if (react) triggerPollReactivity();
    return this;
  }

  getWinner() {
    this.stopVoting().blockSuggestions();

    this.winner = this.voters.size > 0 ? this.rating : null;
    triggerPollReactivity();
    return this.winner;
  }
}

const ratingPollEntity = new RatingPoll();
export const ratingPoll = writable(ratingPollEntity);

function triggerPollReactivity() {
  ratingPoll.set(ratingPollEntity);
}
