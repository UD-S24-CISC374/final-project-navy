import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
// import { evaluateExpression } from "../objects/evaluateExpression";
// import { shiftValues } from "../objects/shiftValues";
// import { removeRow } from "../objects/removeRow";
// import { removeCol } from "../objects/removeCol";
// import { moveSelection } from "../objects/moveSelection";

export default class TutScene extends Phaser.Scene {
    private storyText: Phaser.GameObjects.Text;
    private textContainer: Phaser.GameObjects.Container;
    private imageContainer: Phaser.GameObjects.Container;
    private spriteContainer: Phaser.GameObjects.Container;
    private currentDialogue: string[] = [];
    private currentDialogueIndex: number = 0;
    private typingSpeed: number = 20;
    private isTyping: boolean = false;
    private timer: Phaser.Time.TimerEvent | null = null;

    private board: string[][];

    private tilesGroup: Phaser.GameObjects.Group;
    // private selectedTile: Phaser.GameObjects.Sprite;
    // private selectedTileIndex: number;

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

    init() {
        this.currentDialogue = [];
        this.currentDialogueIndex = 0;
    }

    create() {
        this.add.image(400, 300, "Valley");
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.add.text(300, 100, "Tutorial", {
            fontSize: "32px",
            color: "black",
        });

        this.add.text(150, 250, "*Frog goes here*", {
            fontSize: "25px",
            color: "black",
        });

        this.imageContainer = this.add.container(450, 150);

        const imageContBackground = this.add.graphics();
        //imageContBackground.fillStyle(0x00ff00, 0.5);
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
        this.dialogue("The tiles on the board represent different values");
        this.dialogue(
            '"T" is True, "F" is False, "&" is And, "|" is Or, and "!" is Not'
        );
        this.dialogue(
            "In more advanced levels you'll also see newer blocks, but we don't have to worry about those for now"
        );
        this.dialogue(
            "And so, each of these tiles can be combined together to form a logical sentence, or expression"
        );

        //ADD
        this.dialogue(
            "Take this row of tiles, for example *image of row on screen*"
        );
        this.dialogue('This row represents the sentence "*put sentence here*"');
        this.dialogue(
            "The goal is to create expressions out of these tiles that will evaluate to true"
        );
        this.dialogue(
            "You can move around the board with the WASD keys to change the current block you're on"
        );
        this.dialogue(
            "To make it easier to form sentences, you can shift tiles around with the arrow keys"
        );
        this.dialogue(
            "Go ahead, try it out! Try moving to different blocks and switching their positions"
        );
        //ADD Implement a sort of counter that counts how many times someone moved and shifted blocks
        // Next dialogue would show up once those numbers are reached
        this.dialogue(
            "*This would show up after player moves and shifts blocks x amount of times*"
        );
        this.dialogue("Great! Looks like you've figured it out!");
        this.dialogue(
            "Each level will have a requirement on the kind of matches that need to be made"
        );
        this.dialogue(
            "For example, a level might require you to make 15 matches"
        );
        this.dialogue(
            'Or a level might ask you to make 5 matches containing both "&" and "|" blocks'
        );
        this.dialogue("You'll start each level with a limited number of moves");
        this.dialogue(
            "Every time you change the location of a block and move to a new one, you'll use up one move"
        );
        this.dialogue(
            "To complete a level, you must meet all the level requirements before running out of moves"
        );
        this.dialogue(
            "Once a level is complete, you can move on to the next level"
        );
        this.dialogue(
            "There are three levels in total. Once all three levels are complete, the lighting system will be fixed!"
        );
        this.dialogue(
            "If you find yourself having trouble with forming sentences, you can use the practice levels to improve"
        );
        this.dialogue(
            "The practice levels do not limit your moves and don't have any requirements"
        );
        this.dialogue(
            "That way, you can focus on creating as many sentences as you'd like!"
        );
        this.dialogue(
            "You can learn more about the blocks and forming valid expressions by clicking the help button in the levels"
        );
        this.dialogue(
            "My froggie friends will help explain any new blocks that appear in the levels before you start"
        );
        this.dialogue(
            "Well, that wraps up all you need to know for now! You can always come back here if you need help"
        );
        this.dialogue("Now hurry along, those lights won't fix themselves!");
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
