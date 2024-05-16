import Phaser from "phaser";
import { Button } from "../objects/button";

export default class P2InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "P2InfoScene" });
    }

    create() {
        this.add.image(400, 300, "Valley");
        this.add.image(400, 280, "PInfo");
        this.add
            .text(400, 160, "Level Information", {
                fontSize: "25px",
                color: "white",
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(400, 200, "Board size: 7x7\nPossible tiles:")
            .setOrigin(0.5, 0.5)
            .setLineSpacing(5);

        this.add.rectangle(400, 250, 32, 32, 33333, 0.5);
        this.add
            .text(400, 290, "Level Description", {
                fontSize: "25px",
                color: "white",
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(
                400,
                370,
                "Practice round for level 2.\nNo requirements, no moves, great for making as many matches as possible!"
            )
            .setOrigin(0.5, 0.5)
            .setLineSpacing(5)
            .setWordWrapWidth(260);

        // play button
        new Button(
            this,
            375,
            440,
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
                        this.scene.start("P2PlayScene");
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
