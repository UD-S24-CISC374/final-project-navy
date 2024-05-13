import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: "SelectScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);

        this.add.image(400, 300, "LevelSelect");

        new Button(
            this,
            650,
            35,
            "Tutorial",
            {
                fontSize: "25px",
                color: "red",
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
        new Button(
            this,
            60,
            35,
            "Main Menu",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("MainScene");
                    }
                );
            }
        );

        const levelButtons = [];
        const levels = [
            { text: "Level 1", sceneKey: "Level1InfoScene" },
            { text: "Level 2", sceneKey: "Level2InfoScene" },
            { text: "Level 3", sceneKey: "Level3InfoScene" },
            { text: "Practice 1", sceneKey: "P1InfoScene" },
            { text: "Practice 2", sceneKey: "P2InfoScene" },
            { text: "Practice 3", sceneKey: "P3InfoScene" },
        ];

        let x = 150;
        let y = 200;

        levels.forEach((level, index) => {
            const button = new Button(
                this,
                x,
                y,
                level.text,
                {
                    fontSize: "25px",
                    color: "white",
                },
                () => this.scene.start(level.sceneKey)
            );

            levelButtons.push(button);

            x += 200;
            if ((index + 1) % 3 === 0) {
                x = 150;
                y += 150;
            }
        });
    }

    update() {}
}
