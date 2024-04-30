import Phaser from "phaser";
import { Button } from "../objects/button";

export default class HtpScene extends Phaser.Scene {
    constructor() {
        super({ key: "HtpScene" });
    }

    create() {
        this.add.text(300, 100, "How to Play", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            50,
            35,
            "Back to Menu",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("MainScene")
        );

        this.add.text(
            150,
            200,
            "WASD Keys\nW - Move up\nS - Move down\nA - Move left\nD - Move right\n\nArrow Keys\n↑ - Shift blocks in column up\n↓ - Shift blocks in column down\n← - Shift blocks in row left\n→ - Shift blocks in row right",
            {
                fontSize: "25px",
                color: "black",
            }
        );
    }

    update() {}
}