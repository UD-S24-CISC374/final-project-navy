import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class TutScene extends Phaser.Scene {
    constructor() {
        super({ key: "TutScene" });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.add.text(300, 100, "Tutorial", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            50,
            35,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("TutSong");
                        playMusic(this, "MainSong");
                        this.scene.start("SelectScene");
                    }
                );
            }
        );
    }

    update() {}
}
