import Phaser from "phaser";
import { Button } from "../objects/button";

export default class HtpScene extends Phaser.Scene {
    constructor() {
        super({ key: "HtpScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.image(400, 300, "Valley");
        this.add.image(400, 300, "ControlsBg");

        new Button(
            this,
            50,
            35,
            "Back to Menu",
            {
                fontSize: "25px",
                color: "white",
            },
            () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("MainScene");
                    }
                );
            }
        );

        this.add
            .text(190, 170, "WASD Keys", {
                fontSize: "25px",
                color: "white",
            })
            .setLineSpacing(3);
        this.add
            .text(
                210,
                205,
                "W - Move up\nS - Move down\nA - Move left\nD - Move right\n\n\n\n↑ - Shift blocks in column up\n↓ - Shift blocks in column down\n← - Shift blocks in row left\n→ - Shift blocks in row right",
                {
                    fontSize: "20px",
                    color: "white",
                }
            )
            .setLineSpacing(3);

        this.add
            .text(190, 335, "Arrow Keys", {
                fontSize: "25px",
                color: "white",
            })
            .setLineSpacing(3);
    }

    update() {}
}
