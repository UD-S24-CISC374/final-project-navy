import Phaser from "phaser";
import { Button } from "../objects/button";

export default class Level3InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3InfoScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.image(400, 300, "Valley");
        this.add.image(400, 280, "L3Info");
        this.add
            .text(400, 160, "Level Information", {
                fontSize: "25px",
                color: "white",
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(400, 200, "Board size: 9x9\nPossible tiles:")
            .setOrigin(0.5, 0.5)
            .setLineSpacing(5);

        this.add.image(400, 250, "L3Blocks");
        this.add
            .text(400, 290, "Level requirements", {
                fontSize: "25px",
                color: "white",
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(
                400,
                370,
                "Matches containing:\n5 -> ( and ) blocks\n5 -> !, T, and F blocks\n3 -> matches of every block\n3 -> matches without the | block"
            )
            .setOrigin(0.5, 0.5)
            .setLineSpacing(5);

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
                        this.scene.start("Level3PlayScene");
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
                color: "white",
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
