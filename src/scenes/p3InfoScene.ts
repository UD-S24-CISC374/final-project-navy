import Phaser from "phaser";
import { Button } from "../objects/button";

export default class P3InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "P3InfoScene" });
    }

    create() {
        this.add.text(150, 100, "We will display level requirements here!", {
            fontSize: "20px",
            color: "black",
        });

        // play button
        new Button(
            this,
            250,
            150,
            "Play",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("P3PlayScene");
                    }
                );
            }
        );

        // back to levels button
        new Button(
            this,
            365,
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
                    }
                );
            }
        );
    }

    update() {}
}
