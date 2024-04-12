import Phaser from "phaser";
import { playMusic } from "../objects/musicManager";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("And", "assets/&block.png");
        this.load.image("Or", "assets/orblock.png");
        this.load.image("Not", "assets/!block.png");
        this.load.image("True", "assets/Tblock.png");
        this.load.image("False", "assets/Fblock.png");
        this.load.image("Equals", "assets/=block.png");
        this.load.image("LParen", "assets/Lparen.png");
        this.load.image("RParen", "assets/Rparen.png");
        this.load.image("Row Selector", "assets/RowSelector.png");
        this.load.image("Col Selector", "assets/ColSelector.png");
        this.load.image("RS 7x7", "assets/RowSelector7x7.png");
        this.load.image("CS 7x7", "assets/ColSelector7x7.png");
        this.load.image("RS 9x9", "assets/RowSelector9x9.png");
        this.load.image("CS 9x9", "assets/ColSelector9x9.png");

        this.load.audio("MainSong", ["assets/Vibing-Over-Venus.mp3"]);
        this.load.audio("L1Song", ["assets/Thief-in-the-Night.mp3"]);
        this.load.audio("L2Song", ["assets/Miami-Viceroy.mp3"]);
        this.load.audio("L3Song", ["assets/ZigZag.mp3"]);

        this.load.audio("match", ["assets/match-made.mp3"]);
    }

    create() {
        playMusic(this, "MainSong");
        this.sound.pauseOnBlur = false;
        this.scene.start("MainScene");
    }
}
