import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import SelectScene from "./scenes/selectScene";
import Level1PlayScene from "./scenes/level1PlayScene";
import Level1InfoScene from "./scenes/level1InfoScene";
import Level2PlayScene from "./scenes/level2PlayScene";
import Level2InfoScene from "./scenes/level2InfoScene";
import Level3PlayScene from "./scenes/level3PlayScene";
import Level3InfoScene from "./scenes/level3InfoScene";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export const CONFIG = {
    title: "My Untitled Phaser 3 Game",
    version: "0.0.1",
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        MainScene,
        SelectScene,
        Level1PlayScene,
        Level1InfoScene,
        Level2PlayScene,
        Level2InfoScene,
        Level3PlayScene,
        Level3InfoScene,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 300 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
