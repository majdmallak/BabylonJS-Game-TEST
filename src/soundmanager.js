import { Sound } from "@babylonjs/core";

class SoundManager {
    Musics = Object.freeze({
        START_MUSIC: 0,
        MENU_MUSIC: 1,
        GAME_MUSIC: 2,
        GAME_OVER_MUSIC: 3,
        WIN_MUSIC: 4,
    });
    musics = [];
    sounds = [];
    previousMusic = null;

    constructor() {
        this.previousMusic = -1;
    }

    async init() {
        // Load music and sounds here
        // Example:
        // this.musics.push(new Sound("startMusic", startMusicUrl, scene, null, { loop: true, autoplay: false, volume: 0.5 }));
        // this.sounds.push(new Sound("jumpSound", jumpSoundUrl, scene, null, { loop: false, autoplay: false, volume: 0.7 }));

        // Initialize other properties or settings if necessary
    }

    static get instance() {
        return (globalThis[Symbol.for('PF_SoundManager')] || new this());
    }

    update() {
        // Any periodic updates or checks can be done here
    }

    playMusic(musicIndex) {
        if (this.previousMusic != -1) {
            this.musics[this.previousMusic].stop();
            this.previousMusic = -1;
        }
        if (musicIndex >= 0 && musicIndex < this.musics.length) {
            this.musics[musicIndex].play();
            this.previousMusic = musicIndex;
        }
        return (this.previousMusic != -1);
    }

    playSound(soundIndex, bLoop) {
        if (soundIndex >= 0 && soundIndex < this.sounds.length) {
            this.sounds[soundIndex].play(bLoop);
        }
    }
}

const { instance } = SoundManager;
export { instance as SoundManager };
