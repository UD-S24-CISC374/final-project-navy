import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class Level1WinScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1WinScene" });
    }
    private win: Phaser.Sound.BaseSound;

    create() {
        this.add.image(400, 300, "Valley");
        this.win = this.sound.add("level-win", { loop: false });
        this.win.play();
        this.add.text(150, 100, "YAY you won Level 1", {
            fontSize: "20px",
            color: "black",
        });

        // play button
        new Button(
            this,
            200,
            150,
            "Restart",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                globals.level1Reset = true;
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("Level1PlayScene");
                    }
                );
            }
        );

        // back to levels button
        new Button(
            this,
            375,
            150,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("SelectScene");
                        playMusic(this, "MainSong");
                    }
                );
            }
        );

        new Button(
            this,
            275, // Adjust the X position as needed
            200, // Adjust Y position as needed
            "View Matches",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                const savedState = localStorage.getItem("level1GameState");
                if (savedState) {
                    const gameState = JSON.parse(savedState);
                    if (gameState.matchList) {
                        globals.displayMatchHistory(gameState.matchList);
                    } else {
                        console.log("No matches recorded.");
                    }
                } else {
                    console.log("No game state saved.");
                }
            }
        );
    }

    update() {}
}
