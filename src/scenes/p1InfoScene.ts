import Phaser from "phaser";
import { Button } from "../objects/button";

export default class P1InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "P1InfoScene" });
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
            () => this.scene.start("P1PlayScene")
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
                this.cameras.main.fadeOut(
                    500,
                    0,
                    0,
                    0,
                    (
                        camera: Phaser.Cameras.Scene2D.Camera,
                        progress: number
                    ) => {
                        console.log(progress);
                        if (progress === 1) {
                            this.scene.start("SelectScene");
                        }
                    }
                );
            }
        );
    }

    update() {}
}
