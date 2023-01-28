import { browser } from '$app/environment' // sveltekit environment
import { writable } from "svelte/store";

const volume = 0.69; // nice

export class Sound {
  constructor (data) {
    this.ready = false;

    if (!browser) return;

    if (typeof data === 'string') { // fetching a url
      fetch(data)
      .then(r => r.blob())
      .then(blob => {
        this.fileBlob = URL.createObjectURL(blob);
        this.audio = new Audio(this.fileBlob);
        this.markAsReady();
      });
    } else { // reusing blob data
      this.audio = new Audio(data);
      this.markAsReady();
    }
  }

  markAsReady () {
    this.ready = true;
    //this.forceLoad();
    soundSystem.update(val => {
      val.loaded += 1;
      val.ready = val.loaded === val.total;
      return val;
    });
  }

  forceLoad () { //stub
    if (!this.ready) return;
    this.audio.volume = 0;
    try {
      this.audio.play();
    } catch (e) {
      // user didn't interact xd
    }
  }

  play () {
    if (!this.ready) return;
    this.audio.volume = volume;
    this.audio.play();
  }
  forcePlay () {
    if (!this.ready) return;
    this.audio.volume = volume;
    this.audio.currentTime = 0;
    this.play();
  }
  pause () {
    if (!this.ready) return;
    this.audio.pause();
  }
  stop () {
    if (!this.ready) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  clone () {
    if (!this.ready) return void console.warn("Attempt to clone a non-ready sound", this);
    const clone = new Sound(this.fileBlob);
    return clone;
  }
}

export const sounds = {
  win:      new Sound('snd/r_waaah.mp3'),
  end:      new Sound('snd/r_chosen.mp3'),
  roll:     new Sound('snd/r_tick.mp3'),
  rollmany: new Sound('snd/r_ticks.mp3'),
  start:    new Sound('snd/r_start.mp3'),
  suspense: new Sound('snd/r_suspense.mp3'),
};

export const soundSystem = writable({
  loaded: 0, total: Object.keys(sounds).length, ready: false
});