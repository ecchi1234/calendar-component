import * as FILES from "./sounds.json";

type soundMapType = Record<string, any>;
const SOUNDS: soundMapType = new Map([
  ["ringback", { audio: new Audio(FILES["ringback"]), volume: 1.0 }],
  ["ringing", { audio: new Audio(FILES["ringing"]), volume: 1.0 }],
  ["answered", { audio: new Audio(FILES["answered"]), volume: 1.0 }],
  ["rejected", { audio: new Audio(FILES["rejected"]), volume: 0.5 }],
]);

let initialized = false;
export const AudioPlayerService = {
  initialize() {
    if (initialized) return;

    for (const sound of SOUNDS.values()) {
      sound.audio.volume = 0;

      try {
        sound.audio.play();
      } catch (error) {}
    }

    initialized = true;
  },

  play(name: string, loop?: boolean, relativeVolume?: number) {
    this.initialize();

    if (typeof relativeVolume !== "number") relativeVolume = 1.0;

    const sound = SOUNDS.get(name);

    if (!sound) throw new Error(`unknown sound name "${name}"`);

    try {
      sound.audio.pause();
      sound.audio.currentTime = 0.0;
      sound.audio.volume = (sound.volume || 1.0) * relativeVolume;
      sound.audio.loop = loop !== undefined ? loop : false;
      sound.audio.play();
    } catch (error) {}
  },

  stop(name: string) {
    const sound = SOUNDS.get(name);

    if (!sound) throw new Error(`unknown sound name "${name}"`);

    sound.audio.pause();
    sound.audio.currentTime = 0.0;
  },
};
