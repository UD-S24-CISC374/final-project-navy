import Phaser from "phaser";
import { Button } from "../objects/button";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        this.add.text(180, 200, "Boolean Bonanza (add img)", {
            fontSize: "32px",
            color: "black",
        });

        //Possible reference for some features: https://www.youtube.com/watch?v=OS7neDUUhPE&ab_channel=jestarray

        //Pointerover useful for when implementing hover effects, pointerout is for when it's not hovering on it

        // start button
        new Button(
            this,
            275,
            400,
            "Start",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("SelectScene")
        );

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

    update() {}
}
