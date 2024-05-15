import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.text(250, 180, "Boolean Bonanza", {
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
            260,
            400,
            "Start",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                if (globals.storyTriggered) {
                    this.cameras.main.fadeOut(
                        300,
                        0,
                        0,
                        0,
                        (
                            camera: Phaser.Cameras.Scene2D.Camera,
                            progress: number
                        ) => {
                            console.log(progress);
                            if (progress === 1) {
                                this.scene.start("SelectScene");
                            }
                        }
                    );
                } else {
                    globals.storyTriggered = true;
                    // this.cameras.main.fadeOut(
                    //     500,
                    //     0,
                    //     0,
                    //     0,
                    //     (
                    //         camera: Phaser.Cameras.Scene2D.Camera,
                    //         progress: number
                    //     ) => {
                    //         console.log(progress);
                    //         if (progress === 1) {
                    //             this.scene.start("SIntroScene");
                    //         }
                    //     }
                    // );
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.on(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {
                            stopMusic("MainSong");
                            playMusic(this, "IntroSong");
                            this.scene.start("SIntroScene");
                        }
                    );
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
            () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("HtpScene");
                    }
                );
            }
        );
    }

    update() {}
}
