import Phaser from "phaser";
import { playMusic } from "../objects/musicManager";

const globals = require("../objects/globalVars");

export default class Level3LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3LoseScene" });
    }
    private loss: Phaser.Sound.BaseSound;
    private matchTextGroup: Phaser.GameObjects.Group;

    create() {
        this.add.image(400, 300, "Valley");
        this.add.image(400, 280, "Lose");
        this.add
            .text(
                400,
                175,
                "Try again to beat the level and finish the game!",
                {
                    fontSize: "15px",
                    color: "white",
                }
            )
            .setOrigin(0.5, 0.5)
            .setWordWrapWidth(280);
        this.add
            .text(400, 220, "Matches Made:", {
                fontSize: "25px",
                color: "white",
            })
            .setOrigin(0.5, 0.5);
        this.loss = this.sound.add("level-lost", { loop: false });
        this.loss.play();

        this.add.text(150, 100, "Sorry you lost Level 3:(", {
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
        const resetButton = this.add
            .image(360, 475, "Restart")
            .setInteractive()
            .on("pointerdown", () => {
                globals.level3Reset = true;
                globals.level3Win = false;
                globals.level3Lose = false;
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("Level3PlayScene");
                    }
                );
            });

        resetButton.on("pointerover", () => {
            resetButton.setTint(0xaaaaaa); // Tint on hover
        });

        resetButton.on("pointerout", () => {
            resetButton.clearTint(); // Clear tint on hover out
        });

        const homeButton = this.add
            .image(435, 475, "Home")
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("SelectScene");
                        playMusic(this, "MainSong");
                    }
                );
            });

        homeButton.on("pointerover", () => {
            homeButton.setTint(0xaaaaaa); // Tint on hover
        });

        homeButton.on("pointerout", () => {
            homeButton.clearTint(); // Clear tint on hover out
        });
    }

    displayMatches() {
        const savedState = localStorage.getItem("level3GameState");
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
            const matchText = this.add
                .text(400, yPos - 200, `${match}`, {
                    fontSize: "15px",
                    color: "white",
                })
                .setOrigin(0.5, 0.5)
                .setLineSpacing(3);
            this.matchTextGroup.add(matchText);
        });
    }

    update() {}
}
