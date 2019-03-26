import {Howl} from "howler";

export const AIRHORN_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/airhorn.webm", "assets/sounds/airhorn.mp3"],
  });

export const NOICE_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/noice.webm", "assets/sounds/noice.mp3"],
  });

export const BRUH_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/bruh.webm", "assets/sounds/bruh.mp3"],
  });

export const CARELESS_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/careless.webm", "assets/sounds/careless.mp3"],
  });

export const CRICKETS_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/crickets.webm", "assets/sounds/crickets.mp3"],
  });

export const DAMN_SON_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/damn_son.webm", "assets/sounds/damn_son.mp3"],
  });

export const DEEZ_NUTZ_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/deez_nuts.webm", "assets/sounds/deez_nuts.mp3"],
  });

export const HOT_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/hot.webm", "assets/sounds/hot.mp3"],
  });

export const HOW_COULD_THIS_HAPPEND_TO_ME_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/how_could_this_happend_to_me.webm", "assets/sounds/how_could_this_happend_to_me.mp3"],
  });

export const NOPE_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/nope.webm", "assets/sounds/nope.mp3"],
  });

export const OH_BABY_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/oh_baby.webm", "assets/sounds/oh_baby.mp3"],
  });

export const SANIC_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/sanic.webm", "assets/sounds/sanic.mp3"],
    volume: 0.3,
  });

export const TROMBONE1_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/trombone1.webm", "assets/sounds/trombone1.mp3"],
  });

export const TROMBONE2_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/trombone2.webm", "assets/sounds/trombone2.mp3"],
  });

export const VIOLIN_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/violin.webm", "assets/sounds/violin.mp3"],
    volume: 0.3,
  });

export const WOW_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/wow.webm", "assets/sounds/wow.mp3"],
  });

export const ZELDA_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/zelda.webm", "assets/sounds/zelda.mp3"],
  });

export const OOF1_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/oof1.webm", "assets/sounds/oof1.mp3"],
  });

export const OOF2_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/oof2.webm", "assets/sounds/oof2.mp3"],
  });

export const ANIME_WOW_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/anime-wow.webm", "assets/sounds/anime-wow.mp3"],
  });

export const STAR_THEME_SOUND: Howl = new Howl(
  {
    src: ["assets/sounds/star-theme.webm", "assets/sounds/star-theme.mp3"],
    loop: true,
  });

export const FOUND_DIFFERENCE_SOUNDS: Howl[] = [
  AIRHORN_SOUND, DAMN_SON_SOUND, HOT_SOUND,
  NOICE_SOUND, SANIC_SOUND, WOW_SOUND,
  ZELDA_SOUND, OH_BABY_SOUND, ANIME_WOW_SOUND,
];

export const NO_DIFFERENCE_SOUNDS: Howl[] = [
  BRUH_SOUND, CRICKETS_SOUND, DEEZ_NUTZ_SOUND,
  HOW_COULD_THIS_HAPPEND_TO_ME_SOUND, NOPE_SOUND, TROMBONE1_SOUND,
  TROMBONE2_SOUND, VIOLIN_SOUND, OOF1_SOUND, OOF2_SOUND,
];

export const VICTORY_SOUNDS: Howl[] = [
  CARELESS_SOUND,
];

const SOUNDS: Howl[] = [
  ...FOUND_DIFFERENCE_SOUNDS,
  ...NO_DIFFERENCE_SOUNDS,
  ...VICTORY_SOUNDS,
];

export const stopSounds: () => void = (): void => {
  SOUNDS.forEach((sound: Howl) => sound.stop());
};

export const playRandomSound: (sounds: Howl[]) => void = (sounds: Howl[]): void => {
  stopSounds();
  sounds[Math.floor(Math.random() * sounds.length)].play();
};
