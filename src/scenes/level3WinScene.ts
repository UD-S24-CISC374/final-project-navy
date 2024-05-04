import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic } from "../objects/musicManager";

export default class Level3WinScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3WinScene" });
    }

    create() {
        this.add.text(150, 100, "YAY you won Level 3", {
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
            () => {
                this.scene.start("SelectScene");
                playMusic(this, "MainSong");
            }
        );
    }

    update() {}
}
