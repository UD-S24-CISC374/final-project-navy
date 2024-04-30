import Phaser from "phaser";
import { Button } from "../objects/button";

export default class SIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "SIntroScene" });
    }

    create() {
        this.add.text(300, 100, "Intro Scene", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            700,
            30,
            "Skip",
            {
                fontSize: "25px",
                color: "black",
            },
            () => {
                this.scene.start("SelectScene");
            }
        );
    }

    update() {}
}
