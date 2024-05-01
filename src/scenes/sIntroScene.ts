import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class SIntroScene extends Phaser.Scene {
    private storyText: Phaser.GameObjects.Text;
    private textContainer: Phaser.GameObjects.Container;
    private currentDialogue: string[] = [];
    private currentDialogueIndex: number = 0;
    private typingSpeed: number = 50;
    private isTyping: boolean = false;
    private timer: Phaser.Time.TimerEvent | null = null;

    constructor() {
        super({ key: "SIntroScene" });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // stopMusic("MainSong");
        // playMusic(this, "IntroSong");

        this.sound.pauseOnBlur = false;

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
        );

        this.add.image(400, 480, "Textbox");
        const arrowButton = this.add
            .image(650, 500, "textbox-arrow")
            .setTint(0x7b5e57);
        arrowButton.setInteractive();

        this.textContainer = this.add.container(140, 460);

        this.storyText = this.add.text(10, 10, "", {
            fontSize: "20px",
            color: "white",
        });
        this.storyText.setWordWrapWidth(480);

        const containerBackground = this.add.graphics();
        //containerBackground.fillStyle(0x00ff00, 0.5);
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
                }
            }
        });

        this.dialogue(
            "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small"
        );
        this.dialogue(
            "to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what"
        );
        this.dialogue(
            "humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow!"
        );
        this.dialogue("Let's shake it up a little. Barry! Breakfast is ready!");
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
