import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("And", "assets/&block.png");
        this.load.image("Or", "assets/orblock.png");
        this.load.image("Not", "assets/!block.png");
        this.load.image("True", "assets/Tblock.png");
        this.load.image("False", "assets/Fblock.png");
        this.load.image("Row Selector", "assets/RowSelector.png");
        this.load.image("Col Selector", "assets/ColSelector.png");
    }

    create() {
        this.scene.start("MainScene");
    }
}
