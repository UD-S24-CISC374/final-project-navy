import Phaser from "phaser";

export default class Level1InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1InfoScene" });
    }

    create() {
        this.add.text(150, 100, "We will display level requirements here!", {
            fontSize: "20px",
            color: "black",
        });

        const playButton = this.add
            .text(250, 150, "Play", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level1PlayScene"));
        playButton.setInteractive();

        const backButton = this.add
            .text(365, 150, "Back To Levels", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("SelectScene"));
        backButton.setInteractive();
    }

    update() {}
}
