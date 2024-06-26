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

        this.load.image("Board", "assets/Board.png");
        this.load.image("Board 7x7", "assets/Board7x7.png");
        this.load.image("Board 9x9", "assets/Board9x9.png");
        this.load.image("HelpBox", "assets/HelpBox.png");
        this.load.image("Help", "assets/Help.png");
        this.load.image("Restart", "assets/Restart.png");
        this.load.image("ControlsIcon", "assets/ControlsIcon.png");
        this.load.image("Home", "assets/Home.png");
        this.load.image("ReqBg", "assets/reqBg.png");
        this.load.image("Controls", "assets/ControlsButton.png");
        this.load.image("Start", "assets/Start.png");
        this.load.image("ControlsBg", "assets/Controls.png");

        this.load.image("UArrow", "assets/UArrow.png");
        this.load.image("DArrow", "assets/DArrow.png");
        this.load.image("LArrow", "assets/LArrow.png");
        this.load.image("RArrow", "assets/RArrow.png");

        this.load.image("textbox-arrow", "assets/textbox-arrow.png");
        this.load.image("Textbox", "assets/Textbox.png");

        this.load.image("LevelSelect", "assets/LevelSelect.png");
        this.load.image("L1Info", "assets/L1Info.png");
        this.load.image("L2Info", "assets/L2Info.png");
        this.load.image("L3Info", "assets/L3Info.png");
        this.load.image("PInfo", "assets/PInfo.png");

        this.load.image("Win", "assets/Win.png");
        this.load.image("Lose", "assets/Lose.png");

        this.load.image("L1Blocks", "assets/L1Blocks.png");
        this.load.image("L2Blocks", "assets/L2Blocks.png");
        this.load.image("L3Blocks", "assets/L3Blocks.png");

        this.load.image("L1Title", "assets/L1Title.png");
        this.load.image("L2Title", "assets/L2Title.png");
        this.load.image("L3Title", "assets/L3Title.png");
        this.load.image("PTitle", "assets/PTitle.png");
        this.load.image("Title", "assets/Title.png");

        this.load.image("L1Button", "assets/L1Button.png");
        this.load.image("L2BLock", "assets/L2ButtonLock.png");
        this.load.image("L2BUnlock", "assets/L2ButtonUnlock.png");
        this.load.image("L3BLock", "assets/L3ButtonLock.png");
        this.load.image("L3BUnlock", "assets/L3ButtonUnlock.png");

        this.load.image("P1Button", "assets/P1Button.png");
        this.load.image("P2BLock", "assets/P2ButtonLock.png");
        this.load.image("P2BUnlock", "assets/P2ButtonUnlock.png");
        this.load.image("P3BLock", "assets/P3ButtonLock.png");
        this.load.image("P3BUnlock", "assets/P3ButtonUnlock.png");

        this.load.image("Blurbus", "assets/Blurbus.png");
        this.load.image("Valley", "assets/valley.png");

        this.load.audio("MainSong", ["assets/Vibing-Over-Venus.mp3"]);
        this.load.audio("L1Song", ["assets/Thief-in-the-Night.mp3"]);
        this.load.audio("L2Song", ["assets/Miami-Viceroy.mp3"]);
        this.load.audio("L3Song", ["assets/ZigZag.mp3"]);
        this.load.audio("IntroSong", ["assets/Funk-Game-Loop.mp3"]);
        this.load.audio("TutSong", ["assets/Bossa-Antigua.mp3"]);

        this.load.audio("match", ["assets/match-made.mp3"]);
        this.load.audio("level-lost", ["assets/level-lost.mp3"]);
        this.load.audio("level-win", ["assets/level-win.mp3"]);
    }

    create() {
        playMusic(this, "MainSong");
        this.sound.pauseOnBlur = false;
        this.scene.start("MainScene");
    }
}
