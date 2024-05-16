import Phaser from "phaser";
import { playMusic, stopMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.image(400, 300, "Valley");
        this.add.image(400, 160, "Title");

        //Possible reference for some features: https://www.youtube.com/watch?v=OS7neDUUhPE&ab_channel=jestarray

        // start button
        const startButton = this.add
            .image(250, 400, "Start")
            .setInteractive()
            .on("pointerdown", () => {
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
            });

        startButton.on("pointerover", () => {
            startButton.setTint(0xaaaaaa); // Tint on hover
        });

        startButton.on("pointerout", () => {
            startButton.clearTint(); // Clear tint on hover out
        });

        const htpButton = this.add
            .image(530, 400, "Controls")
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("HtpScene");
                    }
                );
            });

        htpButton.on("pointerover", () => {
            htpButton.setTint(0xaaaaaa); // Tint on hover
        });

        htpButton.on("pointerout", () => {
            htpButton.clearTint(); // Clear tint on hover out
        });
    }

    update() {}
}
