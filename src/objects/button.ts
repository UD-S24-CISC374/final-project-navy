import Phaser from "phaser";

export class Button extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        style: Phaser.Types.GameObjects.Text.TextStyle,
        callback: () => void
    ) {
        super(scene, x, y, text, style);

        this.setInteractive();
        this.on("pointerover", () => {
            console.log("pointerover");
        });
        this.on("pointerdown", () => {
            callback();
        });

        scene.add.existing(this);
    }
}
