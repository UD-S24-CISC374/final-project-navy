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
        this.add.image(400, 300, "Valley");
        this.add.image(400, 170, "Title");

        //Possible reference for some features: https://www.youtube.com/watch?v=OS7neDUUhPE&ab_channel=jestarray

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
