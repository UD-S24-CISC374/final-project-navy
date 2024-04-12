import Phaser from "phaser";

class MusicManager {
    private music: Phaser.Sound.BaseSound | null;
    private currentScene: Phaser.Scene | null;

    constructor() {
        this.music = null;
        this.currentScene = null;
    }

    playMusic(scene: Phaser.Scene, key: string): void {
        if (this.currentScene !== scene) {
            if (this.music !== null) {
                this.music.stop();
            }
            this.currentScene = scene;
            this.music = scene.sound.add(key);
            this.music.play({ loop: true });
        }
    }

    stopMusic(key?: string): void {
        if (this.music !== null) {
            if (!key || this.music.key === key) {
                this.music.stop();
                this.music = null;
                this.currentScene = null;
            }
        }
    }
}

export const musicManager = new MusicManager();
export const playMusic = musicManager.playMusic.bind(musicManager);
export const stopMusic = musicManager.stopMusic.bind(musicManager);
