import Phaser from "phaser";

export default class SIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "SIntroScene" });
    }

    create() {
        this.add.text(300, 100, "Intro", {
            fontSize: "32px",
            color: "black",
        });
    }

    update() {}
}
