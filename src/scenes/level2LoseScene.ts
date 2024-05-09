import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class Level2LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level2LoseScene" });
    }

    create() {
        this.add.text(150, 100, "Sorry you lost Level 2:(", {
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
                globals.level2Reset = true;
                this.scene.start("Level2PlayScene");
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
                this.scene.start("SelectScene");
                playMusic(this, "MainSong");
            }
        );
    }

    update() {}
}
