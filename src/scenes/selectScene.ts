import Phaser from "phaser";
import { Button } from "../objects/button";

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super({ key: "SelectScene" });
    }

    create() {
        this.add.text(300, 100, "Level Select", {
            fontSize: "32px",
            color: "black",
        });

        //TODO: create button class and handle all this in there to make simpler

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

        // main menu button
        // had "const mmButton = new Button" but it never got read so I removed it for now
        new Button(
            this,
            350,
            450,
            "Main Menu",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("MainScene")
        );
    }

    update() {}
}
