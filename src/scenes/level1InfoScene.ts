import Phaser from "phaser";
import { Button } from "../objects/button";

export default class Level1InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1InfoScene" });
    }

    create() {
        this.add.image(400, 280, "L1Info");
        this.add.text(300, 200, "Level requirements", {
            fontSize: "20px",
            color: "white",
        });

        // play button
        new Button(
            this,
            375,
            400,
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
                        this.scene.start("Level1PlayScene");
                    }
                );
            }
        );

        // back to levels button
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
