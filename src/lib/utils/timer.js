import { writable } from "svelte/store";
import { raffle } from "./raffle";

class PersistentTimer {
  constructor(bindToAnything = null) {
    this.render = writable("00:00");
    this.start = Date.now();

    this.boundTo = bindToAnything;

    this.interval = setInterval(() => {
      const diff = Math.floor((Date.now() - this.start) / 1000);
      const mm = Math.floor(diff / 60);
      const ss = diff % 60;
      this.render.update(() => String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0"));
    }, 1000);
  }

  rebind(anything) {
    this.boundTo = anything;
    return this;
  }

  reset() {
    this.start = Date.now();
    this.render.update(() => "00:00");
    return this;
  }

  checkBinding(anything) {
    return anything === this.boundTo;
  }

  destroy() {
    clearInterval(this.interval);
  }
}

const raffleTimerEntity = new PersistentTimer();
raffle.subscribe((v) => {
  if (!raffleTimerEntity.checkBinding(v.winner)) {
    raffleTimerEntity.rebind(v.winner).reset();
  }
});
export const raffleTimer = raffleTimerEntity.render;
