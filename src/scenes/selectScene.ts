import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: "SelectScene" });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.add.text(300, 100, "Level Select", {
            fontSize: "32px",
            color: "black",
        });

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

        const levelButtons = [];
        const levels = [
            { text: "Level 1", sceneKey: "Level1InfoScene" },
            { text: "Level 2", sceneKey: "Level2InfoScene" },
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
                    color: "red",
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

        // Level 3 button with dynamic scene routing based on game state
        const level3State = localStorage.getItem("level3GameState");
        let level3SceneKey = "Level3InfoScene"; // Default to info scene if no game state

        if (level3State) {
            const state = JSON.parse(level3State);
            if (state.win) {
                level3SceneKey = "Level3WinScene";
            } else if (state.lose) {
                level3SceneKey = "Level3LoseScene";
            } else {
                level3SceneKey = "Level3PlayScene"; // Player has started playing but not finished
            }
        }

        new Button(
            this,
            x,
            y,
            "Level 3",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start(level3SceneKey)
        );

        // Main menu button
        new Button(
            this,
            350,
            450,
            "Main Menu",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.cameras.main.fadeOut(
                    500,
                    0,
                    0,
                    0,
                    (
                        camera: Phaser.Cameras.Scene2D.Camera,
                        progress: number
                    ) => {
                        console.log(progress);
                        if (progress === 1) {
                            this.scene.start("MainScene");
                        }
                    }
                );
            }
        );
    }

    update() {}
}
