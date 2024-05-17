import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: "SelectScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.image(400, 300, "Valley");

        this.add.image(400, 300, "LevelSelect");

        new Button(
            this,
            650,
            35,
            "Tutorial",
            {
                fontSize: "25px",
                color: "white",
            },
            () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("MainSong");
                        playMusic(this, "TutSong");
                        this.scene.start("TutScene");
                    }
                );
            }
        );

        // main menu button
        const homeButton = this.add
            .image(60, 50, "Home")
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("MainScene");
                    }
                );
            });

        homeButton.on("pointerover", () => {
            homeButton.setTint(0xaaaaaa); // Tint on hover
        });

        homeButton.on("pointerout", () => {
            homeButton.clearTint(); // Clear tint on hover out
        });

        const levelButtons = [
            "L1Button",
            "L2BLock",
            "L3BLock",
            "P1Button",
            "P2BLock",
            "P3BLock",
        ];
        const levels = [
            { key: "L1", sceneKey: "Level1InfoScene" },
            { key: "L2", sceneKey: "Level2InfoScene" },
            { key: "L3", sceneKey: "Level3InfoScene" },
            { key: "P1", sceneKey: "P1InfoScene" },
            { key: "P2", sceneKey: "P2InfoScene" },
            { key: "P3", sceneKey: "P3InfoScene" },
        ];

        let x = 200;
        let y = 230;

        levels.forEach((level, index) => {
            // Will add after locked levels is implemented
            //const buttonKey = level.locked ? `${level.key}_locked` : level.key;

            const button = this.add
                .image(x, y, levelButtons[index])
                .setInteractive()
                .on("pointerdown", () => {
                    this.cameras.main.fadeOut(300, 0, 0, 0);
                    this.cameras.main.on(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {
                            this.scene.start(level.sceneKey);
                        }
                    );
                    // Will add after locked levels is implemented
                    // if (!level.locked) {
                    //     this.scene.start(level.sceneKey);
                    // } else {
                    //     // Handle locked level click
                    //     console.log("This level is locked!");
                    // }
                });

            button.on("pointerover", () => {
                button.setTint(0xaaaaaa); // Tint on hover
            });

            button.on("pointerout", () => {
                button.clearTint(); // Clear tint on hover out
            });

            x += 200;
            if ((index + 1) % 3 === 0) {
                x = 200;
                y += 180;
            }
        });
    }

    update() {}
}
