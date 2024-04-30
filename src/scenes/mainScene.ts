import Phaser from "phaser";
import { Button } from "../objects/button";

const globals = require("../objects/globalVars");

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

        //NOTE: Considering using level 1 state to determine if intro scene should appear
        //const savedState = localStorage.getItem("level1GameState");

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
            () => {
                if (globals.storyTriggered) {
                    this.scene.start("SelectScene");
                } else {
                    globals.storyTriggered = true;
                    this.scene.start("SIntroScene");
                }
            }
        );

        new Button(
            this,
            400,
            400,
            "How to Play",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("HtpScene")
        );
    }

    update() {}
}
