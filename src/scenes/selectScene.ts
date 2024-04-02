import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class SelectScene extends Phaser.Scene {
    fpsText: FpsText;

    constructor() {
        super({ key: "SelectScene" });
    }

    create() {
        this.fpsText = new FpsText(this);

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.add.text(300, 100, "Level Select", {
            fontSize: "32px",
            color: "black",
        });

        //TODO: create button class and handle all this in there to make simpler
        //NOTE: None of the scenes for the levels have been made yet
        const level1Button = this.add
            .text(150, 200, "Level 1", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level1Scene"));
        level1Button.setInteractive();

        const level2Button = this.add
            .text(350, 200, "Level 2", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level2"));
        level2Button.setInteractive();

        const level3Button = this.add
            .text(550, 200, "Level 3", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level3"));
        level3Button.setInteractive();

        const level4Button = this.add
            .text(150, 350, "Level 4", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level4"));
        level4Button.setInteractive();

        const level5Button = this.add
            .text(350, 350, "Level 5", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level5"));
        level5Button.setInteractive();

        const level6Button = this.add
            .text(550, 350, "Level 6", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("Level6"));
        level6Button.setInteractive();

        const mmButton = this.add
            .text(350, 450, "Main Menu", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("MainScene"));
        mmButton.setInteractive();
    }

    update() {
        this.fpsText.update();
    }
}
