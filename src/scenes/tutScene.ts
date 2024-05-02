import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";
import { moveSelection } from "../objects/moveSelection";

export default class TutScene extends Phaser.Scene {
    private storyText: Phaser.GameObjects.Text;
    private textContainer: Phaser.GameObjects.Container;
    private imageContainer: Phaser.GameObjects.Container;
    private spriteContainer: Phaser.GameObjects.Container;
    private currentDialogue: string[] = [];
    private currentDialogueIndex: number = 0;
    private typingSpeed: number = 50;
    private isTyping: boolean = false;
    private timer: Phaser.Time.TimerEvent | null = null;

    private board: string[][];

    private tilesGroup: Phaser.GameObjects.Group;
    private selectedTile: Phaser.GameObjects.Sprite;
    private selectedTileIndex: number;

    private keyW?: Phaser.Input.Keyboard.Key;
    private keyA?: Phaser.Input.Keyboard.Key;
    private keyS?: Phaser.Input.Keyboard.Key;
    private keyD?: Phaser.Input.Keyboard.Key;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private prevKeyState: { [key: string]: boolean } = {};

    private rowSelector: Phaser.GameObjects.Image;
    private colSelector: Phaser.GameObjects.Image;
    private tileTypes: string[];

    constructor() {
        super({ key: "TutScene" });
        this.tileTypes = [
            "True",
            "True",
            "True",
            "True",
            "False",
            "False",
            "False",
            "False",
            "And",
            "And",
            "And",
            "Or",
            "Or",
            "Or",
            "Not",
            "Not",
        ];
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.add.text(300, 100, "Tutorial", {
            fontSize: "32px",
            color: "black",
        });

        this.imageContainer = this.add.container(450, 150);

        const imageContBackground = this.add.graphics();
        imageContBackground.fillStyle(0x00ff00, 0.5);
        imageContBackground.fillRect(0, 0, 250, 250);
        this.imageContainer.add(imageContBackground);

        this.imageContainer.setVisible(false);

        this.board = generateRandomBoard(5, 5, this.tileTypes);
        const startx = 0;
        const starty = 0;
        let newx = startx;
        let newy = starty;

        this.tilesGroup = this.add.group();
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const tileType = this.board[row][col];
                const xPos = newx + 40;
                const yPos = newy + 40;

                const tileSprite = this.add.sprite(xPos, yPos, tileType);
                tileSprite.setOrigin(0.5);
                tileSprite.setData("tileType", tileType);

                this.tilesGroup.add(tileSprite);
                this.imageContainer.add(tileSprite);
                newx += 40;
            }
            newx = startx;
            newy += 40;
        }

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
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("TutSong");
                        playMusic(this, "MainSong");
                        this.scene.start("SelectScene");
                    }
                );
            }
        );

        this.add.image(400, 480, "Textbox");
        const arrowButton = this.add
            .image(650, 500, "textbox-arrow")
            .setTint(0x7b5e57);
        arrowButton.setInteractive();

        this.add.text(156, 418, "Greebus", {
            fontSize: "25px",
            color: "white",
            align: "center",
        });

        this.textContainer = this.add.container(140, 460);

        this.storyText = this.add.text(10, 10, "", {
            fontSize: "20px",
            color: "white",
        });
        this.storyText.setWordWrapWidth(480);

        const containerBackground = this.add.graphics();
        containerBackground.fillRect(0, 0, 480, 80);
        this.textContainer.add(containerBackground);
        this.textContainer.add(this.storyText);

        arrowButton.on("pointerdown", () => {
            if (this.isTyping) {
                // If typing animation is in progress, stop the animation and display all the text
                if (this.timer) {
                    this.timer.destroy();
                }
                this.storyText.setText(
                    this.currentDialogue[this.currentDialogueIndex - 1]
                );
                this.isTyping = false;
            } else {
                // If not typing, show next dialogue segment or start typing animation
                if (this.currentDialogueIndex < this.currentDialogue.length) {
                    this.typeDialogue(
                        this.currentDialogue[this.currentDialogueIndex]
                    );
                    this.currentDialogueIndex++;
                } else {
                    // If there's no more dialogue left, reset variables and clear text
                    this.currentDialogue = [];
                    this.currentDialogueIndex = 0;
                    this.storyText.setText("");
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.on(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {
                            stopMusic("IntroSong");
                            playMusic(this, "MainSong");
                            this.scene.start("SelectScene");
                        }
                    );
                }
            }
        });

        // this.dialogue(
        //     "humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow!"
        // );
        this.dialogue(
            "You must be a bit confused with how to get started on fixing the lighting system."
        );
        this.dialogue(
            "Well, look no further! I'll guide you through the simple steps and get you ready for repair."
        );
        this.imageContainer.setVisible(true);
        this.dialogue(
            "Each level contains a grid of tiles known as the gameboard."
        );
        this.dialogue(
            "As you progress through the levels, the board will become bigger, and new tiles will be introduced."
        );
    }

    update() {}

    dialogue(dialogue: string) {
        console.log("Adding dialogue:", dialogue);
        this.currentDialogue.push(dialogue);
        if (this.currentDialogue.length === 1) {
            console.log("Starting to show dialogue...");
            this.showNextDialogue();
        }
    }

    showNextDialogue() {
        console.log("Showing next dialogue...");
        if (this.currentDialogueIndex < this.currentDialogue.length) {
            this.typeDialogue(this.currentDialogue[this.currentDialogueIndex]);
            this.currentDialogueIndex++;
        } else {
            this.currentDialogue = [];
            this.currentDialogueIndex = 0;
            this.storyText.setText("");
        }
    }

    typeDialogue(dialogue: string) {
        console.log("Typing dialogue:", dialogue);
        this.isTyping = true;
        this.storyText.setText("");
        let index = 0;
        this.timer = this.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                this.storyText.setText(dialogue.substr(0, index));
                index++;
                if (index > dialogue.length) {
                    if (this.timer) {
                        this.timer.destroy();
                    }
                    this.isTyping = false;
                }
            },
            loop: true,
        });
    }
}
