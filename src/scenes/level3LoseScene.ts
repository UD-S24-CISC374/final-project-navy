import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class Level3LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3LoseScene" });
    }

    private loss: Phaser.Sound.BaseSound;

    create() {
        this.loss = this.sound.add("level-lost", { loop: false });
        this.loss.play();
        this.add.text(150, 100, "Sorry you lost Level 3:(", {
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
                globals.level3Reset = true;
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("Level3PlayScene");
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
    }

    update() {}
}
