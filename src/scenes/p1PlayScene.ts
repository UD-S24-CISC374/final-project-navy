import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class P1PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "P1PlayScene" });
    }

    private recentMatch: string = "";
    private score: number = 0;
    private recentMatchText: Phaser.GameObjects.Text;
    scoreText?: Phaser.GameObjects.Text;

    create() {
        stopMusic("MainSong");
        playMusic(this, "L1Song");
        this.sound.pauseOnBlur = false;

        // back to levels button
        new Button(
            this,
            50,
            35,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                stopMusic("L1Song");
                playMusic(this, "MainSong");
                this.score = 0;
                this.recentMatch = "";
                this.scene.start("SelectScene");
            }
        );

        this.add.text(330, 100, "Practice 1", {
            fontSize: "35px",
            color: "black",
        });
    }

    update() {}
}
