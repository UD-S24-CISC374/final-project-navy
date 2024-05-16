import Phaser from "phaser";

export default class HtpScene extends Phaser.Scene {
    constructor() {
        super({ key: "HtpScene" });
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.add.image(400, 300, "Valley");
        this.add.image(400, 300, "ControlsBg");

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

        this.add
            .text(190, 170, "WASD Keys", {
                fontSize: "25px",
                color: "white",
            })
            .setLineSpacing(3);
        this.add
            .text(
                210,
                205,
                "W - Move up\nS - Move down\nA - Move left\nD - Move right\n\n\n\n↑ - Shift blocks in column up\n↓ - Shift blocks in column down\n← - Shift blocks in row left\n→ - Shift blocks in row right",
                {
                    fontSize: "20px",
                    color: "white",
                }
            )
            .setLineSpacing(3);

        this.add
            .text(190, 335, "Arrow Keys", {
                fontSize: "25px",
                color: "white",
            })
            .setLineSpacing(3);
    }

    update() {}
}
