import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class Level1LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1LoseScene" });
    }
    private loss: Phaser.Sound.BaseSound;
    private matchTextGroup: Phaser.GameObjects.Group;

    create() {
        this.add.image(400, 300, "Valley");
        this.loss = this.sound.add("level-lost", { loop: false });
        this.loss.play();

        this.add.text(150, 100, "Sorry you lost Level 1:(", {
            fontSize: "20px",
            color: "black",
        });

        // Initialize the group for match text
        this.matchTextGroup = this.add.group();

        // Set up other buttons
        this.setupButtons();

        // Automatically display match history
        this.displayMatches();
    }

    setupButtons() {
        new Button(
            this,
            200,
            150,
            "Restart",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                globals.level1Reset = true;
                globals.level1Win = false;
                globals.level1Lose = false;
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("Level1PlayScene");
                    }
                );
            }
        );

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
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("SelectScene");
                        playMusic(this, "MainSong");
                    }
                );
            }
        );
    }

    displayMatches() {
        const savedState = localStorage.getItem("level1GameState");
        if (savedState) {
            const gameState = JSON.parse(savedState);
            if (gameState.matchList) {
                this.showMatchHistory(gameState.matchList);
            } else {
                console.log("No matches recorded.");
            }
        } else {
            console.log("No game state saved.");
        }
    }

    showMatchHistory(matches: string[]) {
        // Clear existing match history texts
        this.matchTextGroup.clear(true, true);

        matches.forEach((match, index) => {
            const yPos =
                this.cameras.main.height - 20 * (matches.length - index); // Displays at the bottom
            const matchText = this.add.text(
                250,
                yPos - 200,
                `Match ${index + 1}: ${match}`,
                {
                    fontSize: "25px",
                    color: "white",
                }
            );
            this.matchTextGroup.add(matchText);
        });
    }

    update() {}
}
