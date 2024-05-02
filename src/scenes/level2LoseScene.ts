import Phaser from "phaser";
import { Button } from "../objects/button";

export default class Level2LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level2LoseScene" });
    }

    create() {
        this.add.text(150, 100, "Sorry you lost :(", {
            fontSize: "20px",
            color: "black",
        });

        // // play button
        // new Button(
        //     this,
        //     200,
        //     150,
        //     "Restart",
        //     {
        //         fontSize: "25px",
        //         color: "red",
        //     },
        //     () => this.scene.start("Level3PlayScene")
        // );

        // back to levels button
        new Button(
            this,
            375,
            150,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("SelectScene")
        );
    }

    update() {}
}
