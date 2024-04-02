import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;

    constructor() {
        super({ key: "MainScene" });
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

        this.add.text(180, 200, "Boolean Bonanza (add img)", {
            fontSize: "32px",
            color: "black",
        });

        //Possible reference for some features: https://www.youtube.com/watch?v=OS7neDUUhPE&ab_channel=jestarray

        //Pointerover useful for when implementing hover effects, pointerout is for when it's not hovering on it
        const startButton = this.add
            .text(275, 400, "Start", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () => this.scene.start("SelectScene"));
        startButton.setInteractive();

        const htpButton = this.add
            .text(400, 400, "How to Play", {
                fontSize: "25px",
                color: "red",
            })
            .on("pointerover", () => {
                console.log("pointerover");
            })
            .on("pointerdown", () =>
                this.add.text(400, 450, "will add later", {
                    fontSize: "25px",
                    color: "green",
                })
            );
        htpButton.setInteractive();
    }

    update() {
        this.fpsText.update();
    }
}
