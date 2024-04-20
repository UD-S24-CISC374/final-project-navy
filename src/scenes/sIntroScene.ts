import Phaser from "phaser";
import { Button } from "../objects/button";

export default class SIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "SIntroScene" });
    }

    create() {
        this.add.text(300, 100, "Intro Scene", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            700,
            30,
            "Skip",
            {
                fontSize: "25px",
                color: "black",
            },
            () => {
                this.scene.start("SelectScene");
            }
        );
    }

    update() {}
}

/*
Stuff I tried for the text box but failed, link to original example:
https://codepen.io/rexrainbow/pen/MzGoJv#

declare module "phaser" {
    interface Scene {
        rexUI: any;
    }
}

// Color of textbox background
const COLOR_MAIN: number = 0x4e342e;
// Color of arrow
const COLOR_LIGHT: number = 0x7b5e57;
// Color of bar
const COLOR_DARK: number = 0x260e04;

const content: string = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;

type textBoxConfig = {
    wrapWidth: number;
    fixedWidth: number;
    fixedHeight: number;
    title: string;
};

export default class SIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "SIntroScene" });
    }

    preload() {
        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
            sceneKey: "rexUI",
        });

        this.load.image(
            "nextPage",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png"
        );
    }

    create() {
        const style: HTMLStyleElement = document.createElement("style");
        // You can change what's on the sides of the screen with background: #fff in the body section"
        style.textContent = `
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                color: #eee;
            }
        `;
        document.head.appendChild(style);

        createTextBox(this, 100, 200, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
            title: "Title",
        }).start(content, 50);

        this.add.text(300, 100, "Intro Scene", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            700,
            30,
            "Skip",
            {
                fontSize: "25px",
                color: "black",
            },
            () => {
                this.scene.start("SelectScene");
            }
        );
    }

    update() {}
}

function createTextBox(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: textBoxConfig
) {
    let wrapWidth: number = config.wrapWidth;
    let fixedWidth: number = config.fixedWidth;
    let fixedHeight: number = config.fixedHeight;
    let titleText: string = config.title;
    let typingMode: string = "page";

    let textBox = scene.rexUI.add
        .textBox({
            x: x,
            y: y,

            typingMode: typingMode,

            background: scene.rexUI.add.roundRectangle({
                radius: 20,
                color: COLOR_MAIN,
                strokeColor: COLOR_LIGHT,
                strokeWidth: 2,
            }),

            icon: scene.rexUI.add.roundRectangle({
                radius: 20,
                color: COLOR_DARK,
            }),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add
                .image(0, 0, "nextPage")
                .setTint(COLOR_LIGHT)
                .setVisible(false),

            title: titleText
                ? scene.add.text(0, 0, titleText, { fontSize: "24px" })
                : undefined,

            separator: titleText
                ? scene.rexUI.add.roundRectangle({
                      height: 3,
                      color: COLOR_DARK,
                  })
                : undefined,

            space: {
                left: 30,
                right: 20,
                top: 20,
                bottom: 20,

                icon: 10,
                text: 10,

                separator: 6,
            },

            align: {
                title: "center",
            },
        })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on(
            "pointerdown",
            () => {
                if (typingMode === "page") {
                    const icon = this.getElement("action").setVisible(false);
                    this.resetChildVisibleState(icon);
                    if (this.isTyping) {
                        this.stop(true);
                    } else if (!this.isLastPage) {
                        this.typeNextPage();
                    }
                }
            },
            textBox
        )
        .on(
            "pageend",
            () => {
                if (this.isLastPage) {
                    return;
                }

                // This part deals with the arrow on the right of the textbox
                const icon: Phaser.GameObjects.GameObject = this.getElement("action").setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                let tween = scene.tweens.add({
                    targets: icon,
                    y: "+=30", // '+=100'
                    ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false,
                });
            },
            textBox
        )
        .on("complete", () => {
            console.log("all pages typing complete");
        });
    return textBox;
}

function getBuiltInText(
    scene: Phaser.Scene,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number
) {
    return scene.add
        .text(0, 0, "", {
            fontSize: "20px",
            wordWrap: {
                width: wrapWidth,
            },
            maxLines: 3,
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

function getBBcodeText(
    scene: Phaser.Scene,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number
) {
    return scene.rexUI.add.BBCodeText(0, 0, "", {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: "20px",
        wrap: {
            mode: "word",
            width: wrapWidth,
        },
        maxLines: 3,
    });
}
*/
